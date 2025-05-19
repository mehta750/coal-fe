import { useFocusEffect } from "expo-router";
import { FieldArray, Formik } from "formik";
import { Fragment, useCallback } from "react";
import * as yup from 'yup';
import API from "../common/api";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikTextInput from "../componets/FormikTextInput";
import Header from "../componets/Header";
import RenderRawMaterials from "../componets/RenderRawMaterial";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
import { fetchRoutes } from "../routes";
import { createEmptyMaterialRow, getTotalPercentage } from "../utils/sales";

const TOTAL_PERCENTAGE = 100

export default function Sale() {
  const { authState } = useAuth();
  const isPartner = authState?.role?.includes('partner');
  const plants = authState?.plants || [];
  const { post, isLoading } = usePostApi();

  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    weight: yup
      .number()
      .typeError('Weight must be a number')
      .required('Weight required')
      .positive('Weight must be greater than 0'),
  });

  const Routes: any = fetchRoutes()
  return (
    <> 
    <Header title={Routes.sale}/>
    <Formik
      initialValues={{
        plant: isPartner ? plants[0].value : '',
        weight: '',
        date: new Date(),
        data: [createEmptyMaterialRow()],
      }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        const { plant, weight, date, data } = values;
        const rawMaterialsJson = data.map(d => ({
          RawMaterialId: d.rawMaterial,
          SalePercentage: Number(d.productPercentage),
        }));

        await post(API.sale, {
          plantId: Number(plant),
          weight: Number(weight),
          saleDate: date,
          rawMaterialsJson: JSON.stringify(rawMaterialsJson),
        });

        resetForm({
          values: {
            plant: values.plant, // don't reset plant
            weight: '',
            date: new Date(),
            data: [createEmptyMaterialRow()],
          }
        });
      }}
    >
      {({ handleSubmit, isSubmitting, resetForm, values, setFieldValue }) => {
        useFocusEffect(useCallback(() => {
          resetForm({
            values: {
              plant: values.plant,
              weight: '',
              date: new Date(),
              data: [createEmptyMaterialRow()],
            }
          });
        }, []));

        const total = getTotalPercentage(values.data);

        return (
          <ScrollViewComponent>
            <PlantSelection />
            <FormikTextInput name="weight" label="Weight" width={300} keyboardType="numeric" />
            <FieldArray name="data">
              {() => values.data.map((item, index) => (
                <Fragment key={index}>
                  <RenderRawMaterials
                    data={values.data}
                    setFieldValue={setFieldValue}
                    weight={values.weight}
                    item={item}
                    plant={values.plant}
                    index={index}
                  />
                </Fragment>
              ))}
            </FieldArray>
            <FormikDateTimePicker name="date" />
            <Button
              disabled={total !== TOTAL_PERCENTAGE}
              h={32}
              onPress={handleSubmit as any}
              isLoading={isSubmitting && isLoading}
            />
          </ScrollViewComponent>
        );
      }}
    </Formik>
    </>
  );
}
