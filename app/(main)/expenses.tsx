import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { useCallback, useEffect, useMemo } from "react";
import * as yup from 'yup';
import { API } from "../common/api";
import PartySelection from "../common/PartySelection";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikDropdown from "../componets/FormikDropdown";
import FormikTextInput from "../componets/FormikTextInput";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import { usePostApi } from "../helper/api";

export default function Expenses() {
  const { post, isLoading } = usePostApi()
  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    expenseType: yup.string().required('ExpenseType required'),
    miscExpenseType: yup.string().when('expenseType', (expenseType, schema) => {
      return expenseType === 'misc'
        ? schema.required('Misc expenseType is required').min(1, 'Misc expenseType cannot be empty')
        : schema.strip();
    }),
    billNumber: yup.string().required('Bill number required'),
    gst: yup.string().required('Gst required'),
    party: yup.string().required('Party name required'),
  });


  const expenseTypes = ["Labour/Man power", "Electricity", "Machine", "Misc"]
  const gst = [0, 5, 12, 18]
  const gstData = useMemo(() => gst.map(g => ({ label: String(g), value: String(g) })), []);
  const expenseTypesData = useMemo(() => expenseTypes.map(ex => ({
    label: ex,
    value: ex.toLowerCase()
  })), []);
  return (
    <Formik
      initialValues={{ miscExpenseType: '', plant: '', expenseType: '', billNumber: '', billValue: '', gst: '', billAmount: '', date: new Date(), party: '' }}
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
          setFieldValue("billAmount", tempBillAmount.toFixed(2));
        }, [values.billValue, values.gst])

        useFocusEffect(
          useCallback(() => {
            resetForm()
          }, [])
        );

        return (
          <ScrollViewComponent>
            <PlantSelection />
            <FormikDropdown name="expenseType" items={expenseTypesData} placeholder="Select expense type" />
            {
              values.expenseType === "misc" && <FormikTextInput name="miscExpenseType" label="Expense type" width={250} />
            }
            <FormikTextInput name="billNumber" label="Bill number" width={250} />
            <FormikTextInput name="billValue" label="Bill value" width={250} />
            <FormikDropdown name="gst" items={gstData} placeholder="Select GST" />
            <FormikTextInput name="billAmount" label="Bill amount" width={250} enabled={false} />
            <FormikDateTimePicker name="date" />
            <PartySelection />
            <Space h={20} />
            <Button h={32} isLoading={isSubmitting && isLoading} onPress={handleSubmit as any} />
          </ScrollViewComponent>
        )
      }}
    </Formik>
  )
}