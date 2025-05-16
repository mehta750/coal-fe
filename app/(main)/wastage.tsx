import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import * as yup from 'yup';
import API, { getFetchApi, useRawMaterialFetch } from "../common/api";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import CustomText from "../componets/CustomText";
import FormikDropdown from "../componets/FormikDropdown";
import FormikTextInput from "../componets/FormikTextInput";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import { Colors } from "../constant";
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
import showToast from "../helper/toast";

export default function Wastage() {
  const { authState } = useAuth()
  const role = authState?.role
  const isPartner = role?.includes('partner')
  const plants = authState?.plants || []
  const rawMaterialsResult = useRawMaterialFetch() as any
  const { post, isLoading } = usePostApi()
  const [rawMaterialQuantityLoader, setRawMaterialQuantityLoader] = useState(false)
  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    rawMaterial: yup.string().required('Raw material required'),
    wastage: yup.string().required("Wastage required"),
    reason: yup.string().required("Reason required")
  });
  const [wastageQuantity, setWastageQuantity] = useState<number | null>(null)
  const rawMaterialsData = rawMaterialsResult?.data?.map((raw: any) => ({ label: raw?.rawMaterialName, value: raw?.rawMaterialId }))
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ plant: isPartner ? plants[0].value : '', rawMaterial: '', wastage: '', reason: '' }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        const { plant, rawMaterial, wastage, reason } = values
        const payload = {
          plantId: plant,
          rawMaterialId: rawMaterial,
          wastagePercentage: Number(wastage),
          wastageReason: reason
        }
        await post(API.wastage, payload)
        setWastageQuantity(null)
        resetForm()
      }}
    >
      {({ handleSubmit, isSubmitting, values, resetForm, setFieldValue }) => {
        const fetchWastageQuantity = async () => {
          setRawMaterialQuantityLoader(true)
          const quantitresult = await getFetchApi(`${API.wastage_available_quantity}/${Number(values.plant)}/${Number(values.rawMaterial)}`) as any

          if (quantitresult?.data || quantitresult?.data === 0) {
            setWastageQuantity(quantitresult.data)
          }
          else {
            showToast("error", 'Error', quantitresult?.data.detail || 'Something went wrong...')
          }
          setRawMaterialQuantityLoader(false)
        }

        useFocusEffect(
          useCallback(() => {
            resetForm()
            setWastageQuantity(null)
          }, [])
        );
        useEffect(() => {
          if (values.plant && values.rawMaterial) {
            fetchWastageQuantity()
          }
          else {
            setWastageQuantity(null)
          }
        }, [values.plant, values.rawMaterial])

        return (
          <ScrollViewComponent>
            <PlantSelection />
            <FormikDropdown label={"Raw material"} name="rawMaterial" items={rawMaterialsData} placeholder="Select a raw material" />
            <RenderRawMaterialQuantity loader={rawMaterialQuantityLoader} data={wastageQuantity}/>
            <FormikTextInput enabled={wastageQuantity !== 0} name="wastage" label="% of wastage" width={250} keyboardType={'numeric'}/>
            <FormikTextInput multiline enabled={wastageQuantity !== 0} name="reason" label="Reason" width={250} />
            <Space h={6} />
            <Button h={32} disabled={wastageQuantity === 0} isLoading={isSubmitting && isLoading} onPress={handleSubmit as any} />
          </ScrollViewComponent>
        )
      }}
    </Formik>
  )
}

const RenderRawMaterialQuantity = ({loader, data}:{loader: boolean,data: any}) => {
  if(loader)
    return <ActivityIndicator size={'small'}/>
  if(data || data === 0){
    return <CustomText size={12} color={Colors.textBlackColor} text={`Available raw material quantity:${data}`} />
  }
  return null
}