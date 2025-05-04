import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { useCallback } from "react";
import * as yup from 'yup';
import { API } from "../common/api";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import CustomText from "../componets/CustomText";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikTextInput from "../componets/FormikTextInput";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import { usePostApi } from "../helper/api";

export default function Sale() {
    const { post, isLoading } = usePostApi()
    const schema = yup.object().shape({
        plant: yup.string().required('Plant required'),
        weight: yup.number().required('Weight required'),
    });
    return (
        <Formik
            initialValues={{ plant: '', weight: '', date: new Date() }}
            validationSchema={schema}
            onSubmit={async (values, { resetForm }) => {
                await post(API.sale, values)
                resetForm()
            }}

        >
            {({ handleSubmit, isSubmitting, resetForm }) => {
                useFocusEffect(
                    useCallback(() => {
                        resetForm()
                    }, [])
                );
                return (
                    <ScrollViewComponent>
                        <PlantSelection />
                        <FormikTextInput name="weight" label="Weight" width={250} />
                        <FormikDateTimePicker name="date" />
                        <CustomText text={"Multiple raw material doubts"} />
                        <Space h={20} />
                        <Button h={32} onPress={handleSubmit as any} isLoading={isSubmitting && isLoading} />
                    </ScrollViewComponent>
                )
            }}
        </Formik>
    )
}