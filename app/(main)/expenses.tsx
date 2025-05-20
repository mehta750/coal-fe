import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from 'yup';
import API, { postAPI } from "../common/api";
import PartySelection from "../common/PartySelection";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import Center, { DIRECTION } from "../componets/Center";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikDropdown from "../componets/FormikDropdown";
import FormikTextInput from "../componets/FormikTextInput";
import Header from "../componets/Header";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import FloatingLabelInput from '../componets/TextInput';
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
import showToast from "../helper/toast";
import { useLocalisation } from "../locales/localisationContext";
import { fetchRoutes } from "../routes";

export default function Expenses() {
  const { t } = useLocalisation()
  const { post, isLoading } = usePostApi()
  const { authState, callPartnerParties } = useAuth()
  const [isPartyAddLoader, setPartyAddLoader] = useState(false)
  const [newPartyAddError, setNewPartyAddError] = useState<string | null>(null)
  const [newParty, setNewParty] = useState("")
  const [plantId, setPlantId] = useState("")
  const [newPartyAddedValue, setNewPartyAddedValue] = useState<string | number | null>(null)
  const role = authState?.role
  const isPartner = role?.includes('partner')
  const plants = authState?.plants || []
   const [refetchParty, setRefetchParty] = useState(false)
  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    expenseType: yup.string().required('Expense type required'),
    miscExpenseType: yup.string().when('expenseType', (expenseType: any, schema) => {
      return expenseType === 'misc'
        ? schema.required('Misc expenseType is required').min(1, 'Misc expenseType cannot be empty')
        : schema.strip();
    }),
    billNumber: yup.string().required('Bill number required'),
    billValue: yup.string().required('Bill value required'),
    gst: yup.string().required('Gst required'),
    party: yup.string().required('Party name required'),
  });

  useEffect(() => {
    setNewPartyAddError(null)
  }, [newParty])
  const handleNewPartyAdd = async () => {
    if (newParty === '') {
      setNewPartyAddError("Please enter party name")
      return
    }
    if (plantId === '') {
      setNewPartyAddError("Please select plant")
      return
    }
    const firstChar = newParty.charAt(0);
    const hasNumber = /\d/.test(firstChar);
    if (hasNumber) {
      setNewPartyAddError("First char number not allowed")
      return
    }
    setPartyAddLoader(true)
    const p:any = await postAPI(API.partyURL, { partyName: newParty, plantId })
    if(p?.data){
      setNewPartyAddedValue(p.data?.partyId)
    }
    else{
      setNewPartyAddError(p)
      setPartyAddLoader(false)
      return
    }
    if (isPartner) {
      callPartnerParties()
    }
    else {
      setRefetchParty(true)
    }
    showToast("info", "Added", '')
    setNewParty("")
    setPartyAddLoader(false)
  }

  const expenseTypes = ["Labour/Man power", "Electricity", "Machine", "Misc"]
  const gst = [0, 5, 12, 18]
  const gstData = useMemo(() => gst.map(g => ({ label: String(g), value: String(g) })), []);
  const expenseTypesData = useMemo(() => expenseTypes.map(ex => ({
    label: ex,
    value: ex.toLowerCase()
  })), []);
  return (
    <Formik
      initialValues={{ miscExpenseType: '', plant: isPartner ? plants[0].value : '', expenseType: '', billNumber: '', billValue: '', gst: '0', billAmount: '', date: new Date(), party: '' }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        const { plant, expenseType, billNumber, billValue, gst, billAmount, date, party, miscExpenseType } = values
        const payload = {
          plantId: plant,
          expenseType: expenseType === 'misc' ? miscExpenseType : expenseType,
          billNumber,
          billValue: Number(billValue),
          gst: Number(gst),
          totalBillAmount: Number(billAmount),
          expenseDate: date,
          partyId: party
        }
        await post(API.expenses, payload)
        resetForm()
      }}
    >
      {({ handleSubmit, isSubmitting, values, setFieldValue, resetForm }) => {

        const tempBillAmount = Number(values.billValue) + Number(values.billValue) * Number(values.gst) / 100

        useEffect(() => {
          if (newPartyAddedValue) {
            setFieldValue('party', newPartyAddedValue)
          }
        }, [newPartyAddedValue])
        useEffect(() => {
          setPlantId(String(values.plant))
          setFieldValue("billAmount", tempBillAmount.toFixed(2));
        }, [values.billValue, values.gst, values.plant])
        useFocusEffect(
          useCallback(() => {
            resetForm()
          }, [])
        );

        const Routes: any = fetchRoutes()
        return (
          <>
            <Header title={Routes.expenses} />
            <ScrollViewComponent>
              <PlantSelection />
              <FormikDropdown width={300} label={"Expense"} name="expenseType" items={expenseTypesData} placeholder="Select expense type" />
              {
                values.expenseType === "misc" && <FormikTextInput name="miscExpenseType" label="Expense type" width={300} />
              }
              <FormikTextInput name="billNumber" label="Bill number" width={300} />
              <FormikTextInput name="billValue" label="Bill value" width={300} keyboardType={'numeric'} />
              <FormikDropdown width={300} label={"GST"} name="gst" items={gstData} placeholder="Select GST" />
              <FormikTextInput name="billAmount" label="Bill amount" width={300} enabled={false} />
              <FormikDateTimePicker width={300} name="date" />
              <PartySelection width={300} refetchOnMount={refetchParty} />
              <Center width={300} gap={10} direction={DIRECTION.Row}>
                <FloatingLabelInput error={newPartyAddError} width={240} label="New Party" value={newParty} setValue={setNewParty} />
                <Button label={t('add')} w={50} h={33} onPress={handleNewPartyAdd} isLoading={isPartyAddLoader} />
              </Center>
              <Button h={32} isLoading={isSubmitting && isLoading} onPress={handleSubmit as any} />
            </ScrollViewComponent>
          </>
        )
      }}
    </Formik>
  )
}