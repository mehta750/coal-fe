import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { useCallback } from "react";
import * as yup from 'yup';
import API from "../common/api";
import PartySelection from "../common/PartySelection";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikTextInput from "../componets/FormikTextInput";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
export default function Payments() {
  const { authState } = useAuth()
  const role = authState?.role
  const isPartner = role?.includes('partner')
  const plants = authState?.plants || []
  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    party: yup.string().required('Party name required'),
    amount: yup.number().required('Amount required'),
  });
  const { post, isLoading } = usePostApi()
  return (
    <Formik
      initialValues={{ plant: '', date: new Date(), party: '', amount: '' }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        const { plant, party, amount, date } = values
        const payload = {
          plantId: plant,
          partyId: party,
          amount: Number(amount),
          paymentDate: date
        }
        await post(API.payments, payload)
        resetForm()
      }}
    >
      {({ handleSubmit, isSubmitting, resetForm, setFieldValue }) => {
        useFocusEffect(
          useCallback(() => {
            resetForm()
            if (isPartner) {
              setFieldValue('plant', plants[0].value)
            }
          }, [])
        );
        return (
          <ScrollViewComponent>
            <PlantSelection />
            <FormikDateTimePicker name="date" />
            <PartySelection />
            <FormikTextInput name="amount" label="Amount" width={250} />
            <Space h={20} />
            <Button h={32} onPress={handleSubmit as any} isLoading={isSubmitting && isLoading} />
          </ScrollViewComponent>
        )
      }}
    </Formik>
  )
}