import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { useCallback } from "react";
import * as yup from 'yup';
import API from "../common/api";
import PartySelection from "../common/PartySelection";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import CustomText from "../componets/CustomText";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikTextInput from "../componets/FormikTextInput";
import Header from "../componets/Header";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import { Colors } from "../constant";
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
import { fetchRoutes } from "../routes";
export default function Payments() {
  const { authState } = useAuth()
  const role = authState?.role
  const isPartner = role?.includes('partner')
  const plants = authState?.plants || []
  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    party: yup.string().required('Party name required'),
    amount: yup
      .number()
      .typeError('Amount must be a number')
      .required('Amount required')
      .positive('Amount must be greater than 0')
  });
  const { post, isLoading, error } = usePostApi()
  return (
    <Formik
      initialValues={{ plant: isPartner ? plants[0].value : '', date: new Date(), party: '', amount: '' }}
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
          }, [])
        );
        const Routes: any = fetchRoutes()
        return (
          <>
            <Header title={Routes.payments} />
            <ScrollViewComponent gap={30}>
              <PlantSelection />
              <FormikDateTimePicker name="date" />
              <PartySelection />
              <FormikTextInput name="amount" label="Amount" width={300} keyboardType={"numeric"} />
              <Button size={16} h={32} onPress={handleSubmit as any} isLoading={isSubmitting && isLoading} />
              {
                error && <CustomText text={error} size={12} color={Colors.textErrorColor} />
              }
            </ScrollViewComponent>
          </>
        )
      }}
    </Formik>
  )
}