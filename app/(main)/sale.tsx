import { useFocusEffect } from "expo-router";
import { FieldArray, Formik } from "formik";
import { Fragment, useCallback, useEffect } from "react";
import * as yup from 'yup';
import API, { getFetchApi } from "../common/api";
import PlantSelection from "../common/PlantSelection";
import RawMaterialSelection from "../common/RawMaterialSelection";
import Button from "../componets/Button";
import CustomText from "../componets/CustomText";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikTextInput from "../componets/FormikTextInput";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import { Colors } from "../constant";
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";

type RawMaterialsObj = {
    rawMaterial: string | number
    rawMaterialAvailableQuantity: number | null
    dublicateRMError: string | null
    productPercentage: number | string
    error: string | null
}

const TOTAL_PERCENTAGE = 100

export default function Sale() {
    const { authState } = useAuth()
    const role = authState?.role
    const isPartner = role?.includes('partner')
    const plants = authState?.plants || []
    const { post, isLoading } = usePostApi()
    const schema = yup.object().shape({
        plant: yup.string().required('Plant required'),
        weight: yup.number().required('Weight required'),
    });

    const RenderRawMaterials = ({ data, setFieldValue, weight, item, plant, index }: { data: RawMaterialsObj[], setFieldValue: any, weight: string, item: RawMaterialsObj, plant: string, index: number }) => {
        let tempData = [...data];
        const fetchRamarterialQuantity = async () => {
            const rawMaterialQuantityResult: any = await getFetchApi(`${API.raw_material_quantity}?rawMaterialId=${item.rawMaterial}&plantId=${plant}`)
            const quantity = rawMaterialQuantityResult?.data[0]?.availableQuantity
            tempData = tempData.map((d, i) =>
                i === index ? { ...d, rawMaterialAvailableQuantity: quantity }
                    : d
            )
            setFieldValue('data', tempData)
        }
        useEffect(() => {
            const selectedRawMaterials = tempData.map((d: any) => d.rawMaterial);
            const isDuplicate = selectedRawMaterials.filter((rm: any, i: any) =>
                rm !== "" && selectedRawMaterials.indexOf(rm) !== i
            ).includes(item.rawMaterial);

            tempData = tempData.map((d, i) =>
                i === index ? { ...d, dublicateRMError: isDuplicate ? "Raw material already selected" : null } : d
            );


            if (item.rawMaterial && !tempData[index].dublicateRMError) {
                fetchRamarterialQuantity();
            }
            else {
                tempData = tempData.map((d, i) =>
                    i === index ? { ...d, rawMaterialAvailableQuantity: null } : d
                );
            }
            setFieldValue("data", tempData);
        }, [plant, item.rawMaterial]);

        useEffect(() => {
            let hasError = false;
            if (weight && item.productPercentage && item.rawMaterialAvailableQuantity !== null) {
                const productUsed = Number(weight) * Number(item.productPercentage) * 0.01;
                if (productUsed > item.rawMaterialAvailableQuantity) {
                    hasError = true;
                    tempData = tempData.map((d, i) =>
                        i === index ? { ...d, error: "Used quantity exceeds available stock" } : d
                    );
                } else {
                    tempData = tempData.map((d, i) =>
                        i === index ? { ...d, error: null } : d
                    );
                }
            }

            if (hasError && data.length > 1) {
                const last = tempData[tempData.length - 1];
                const isLastBlank = !last.rawMaterial && !last.productPercentage;
                if (isLastBlank) {
                    tempData.splice(tempData.length - 1, 1);
                }
            }

            if (!hasError) {
                const totalPercentage = tempData.reduce((acc, cur) => acc + Number(cur.productPercentage || 0), 0);
                const isLast = index === tempData.length - 1;
                const isFilled = item.rawMaterial && item.productPercentage;
                const selectedRawMaterials = tempData.map((d: any) => d.rawMaterial);
                const isDuplicate = selectedRawMaterials.filter((rm: any, i: any) =>
                    rm !== "" && selectedRawMaterials.indexOf(rm) !== i
                ).includes(item.rawMaterial);

                if (isLast && isFilled && totalPercentage < TOTAL_PERCENTAGE && !isDuplicate) {
                    tempData.push({
                        rawMaterial: "",
                        rawMaterialAvailableQuantity: null,
                        dublicateRMError: null,
                        productPercentage: "",
                        error: null
                    });
                }
                else if (totalPercentage === TOTAL_PERCENTAGE) {
                    tempData = tempData.filter((t) => t.rawMaterial !== '')
                }
            }

            setFieldValue("data", tempData);
        }, [item.rawMaterial, item.productPercentage, weight]);

        return (
            <>
                <RawMaterialSelection name={`data[${index}].rawMaterial`} />
                {
                    !!item.dublicateRMError && <CustomText color={Colors.textErrorColor} size={12} text={item.dublicateRMError} />
                }
                {
                    (!!item?.rawMaterialAvailableQuantity || item?.rawMaterialAvailableQuantity === 0) && <CustomText size={12} text={`Available raw material quantity: ${item?.rawMaterialAvailableQuantity}`} />
                }
                <FormikTextInput enabled={!item.dublicateRMError} keyboardType={"numeric"} name={`data[${index}].productPercentage`} label="% in product" width={250} />
                {!!item.error && <CustomText color={Colors.textErrorColor} size={11} text={item.error} />}
            </>
        )

    }
    return (
        <Formik
            initialValues={{
                plant: '', weight: '', date: new Date(), data: [{
                    rawMaterial: "",
                    rawMaterialAvailableQuantity: null,
                    dublicateRMError: null,
                    productPercentage: "",
                    error: null
                }]
            }}
            validationSchema={schema}
            onSubmit={async (values, { resetForm }) => {
                const { plant, weight, date, data } = values
                const rawMaterialsJson = data.map((d) => ({ RawMaterialId: d.rawMaterial, SalePercentage: Number(d.productPercentage) }))
                const payload = {
                    "plantId": Number(plant),
                    "weight": Number(weight),
                    "saleDate": date,
                    "rawMaterialsJson": JSON.stringify(rawMaterialsJson)
                }
                await post(API.sale, payload)
                resetForm()
            }}

        >
            {({ handleSubmit, isSubmitting, resetForm, values, setFieldValue }) => {
                const { plant, weight, data } = values
                useFocusEffect(
                    useCallback(() => {
                        resetForm()
                        if (isPartner) {
                            setFieldValue('plant', plants[0].value)
                        }
                        setFieldValue('data', [{
                            rawMaterial: "",
                            rawMaterialAvailableQuantity: null,
                            dublicateRMError: null,
                            productPercentage: "",
                            error: null
                        }])
                    }, [])
                );
                const totalPercentage = data.reduce((acc, cur) => acc + Number(cur.productPercentage || 0), 0);
                return (
                    <ScrollViewComponent>
                        <PlantSelection />
                        <FormikTextInput name="weight" label="Weight" width={250} keyboardType={'numeric'} />
                        <FieldArray name="data">
                            {({ push, remove }) => (
                                data?.map((item, index) => <Fragment key={index}><RenderRawMaterials data={data} setFieldValue={setFieldValue} weight={weight} item={item} plant={plant} index={index} /></Fragment>)
                            )}
                        </FieldArray>
                        <FormikDateTimePicker name="date" />
                        <Space h={20} />
                        <Button disabled={totalPercentage !== TOTAL_PERCENTAGE} h={32} onPress={handleSubmit as any} isLoading={isSubmitting && isLoading} />
                    </ScrollViewComponent>
                )
            }}
        </Formik>
    )
}