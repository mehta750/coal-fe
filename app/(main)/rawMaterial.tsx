import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as yup from 'yup';
import API, { postAPI } from "../common/api";
import PartySelection from "../common/PartySelection";
import PlantSelection from "../common/PlantSelection";
import RawMaterialSelection from "../common/RawMaterialSelection";
import Button from "../componets/Button";
import Center, { DIRECTION } from "../componets/Center";
import CustomText from "../componets/CustomText";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikDropdown from "../componets/FormikDropdown";
import FormikTextInput from "../componets/FormikTextInput";
import Header from "../componets/Header";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import FloatingLabelInput from '../componets/TextInput';
import { Colors } from "../constant";
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
import showToast from "../helper/toast";
import { useLocalisation } from "../locales/localisationContext";
import { fetchRoutes } from "../routes";

export default function RawMaterial() {
    const { post, isLoading, error } = usePostApi()
    const { authState, callPartnerParties } = useAuth()
    const plants = authState?.plants || []
    const role = authState?.role
    const isPartner = role?.includes("partner")
    const schema = yup.object().shape({
        plant: yup.string().required('Plant required'),
        billNumber: yup.string().required('Bill number required'),
        billValue: yup.string().required('Bill value required'),
        billAmount: yup.string().required('Bill amount required'),
        weight: yup
            .number()
            .typeError('Weight must be a number')
            .required('Weight required')
            .positive('Weight must be greater than 0'),
        rate: yup.number().required('Rate required'),
        gst: yup.string().required('Gst required'),
        party: yup.string().required('Party name required'),
        rawMaterial: yup.string().required('Raw material required'),
    });
    const gst = [0, 5, 12, 18]
    const gstData = gst.map((g) => ({ label: String(g), value: g }))
    const [newParty, setNewParty] = useState("")
    const [newRawMaterial, setNewRawMaterial] = useState("")
    const [plantId, setPlantId] = useState("")
    const [refetchParty, setRefetchParty] = useState(false)
    const [refetchRawMaterial, setRefetchRawMaterial] = useState(false)
    const [isPartyAddLoader, setPartyAddLoader] = useState(false)
    const [isRawMaterialAddLoader, setRawMaterialAddLoader] = useState(false)
    const [newPartyAddError, setNewPartyAddError] = useState<string | null>(null)
    const [newPartyAddedValue, setNewPartyAddedValue] = useState<string | number | null>(null)
    const [newRawMaterialAddError, setNewRawMaterialAddError] = useState<string | null>(null)
    const [newRawMaterialAddedValue, setNewRawMaterialAddedValue] = useState<string | number | null>(null)

    useEffect(() => {
        setNewPartyAddError(null)
    }, [newParty])

    const handleNewRawMaterialAdd = async () => {
        if (newRawMaterial === '') {
            setNewRawMaterialAddError("Please enter raw material name")
            return
        }
        const firstChar = newRawMaterial.charAt(0);
        const hasNumber = /\d/.test(firstChar);
        if (hasNumber) {
            setNewRawMaterialAddError("First char number not allowed")
            return
        }
        setRawMaterialAddLoader(true)
        const rm: any = await postAPI(API.rawmaterial, { rawMaterialName: newRawMaterial })
        if (rm?.data) {
            setNewRawMaterialAddedValue(rm.data?.rawMaterialId)
        }
        else {
            setNewRawMaterialAddError(rm)
            setRawMaterialAddLoader(false)
            return
        }
        setRefetchRawMaterial(true)
        showToast("info", "Added", '')
        setNewRawMaterial("")
        setRawMaterialAddLoader(false)

    }

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
        const p: any = await postAPI(API.partyURL, { partyName: newParty, plantId })
        if (p?.data) {
            setNewPartyAddedValue(p.data?.partyId)
        }
        else {
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
    const { t } = useLocalisation()
    const Routes: any = fetchRoutes()
    return (
        <>
            <Header title={Routes.rawMaterial} />
            <Formik
                initialValues={{ plant: isPartner ? plants[0].value : '', billNumber: '', weight: '', rate: '', billValue: '', gst: 5, billAmount: '', date: new Date(), rawMaterial: "", party: "" }}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                    const { billAmount, billNumber, billValue, date, gst, party, plant, rate, weight, rawMaterial } = values
                    const payload = {
                        plantId: Number(plant),
                        billNumber: billNumber,
                        weight: Number(weight),
                        rate: Number(rate),
                        billValue: Number(billValue),
                        gst: Number(gst),
                        totalBillAmount: Number(billAmount),
                        purchaseDate: date,
                        rawMaterialId: rawMaterial,
                        partyId: Number(party)
                    }
                    await post(API.rawMaterialPurchaseURL, payload)
                    resetForm()
                }}
            >
                {({ handleSubmit, isSubmitting, values, setFieldValue, resetForm }) => {
                    const tempBillValue = Number(values.rate) * Number(values.weight)
                    const tempBillAmount = Number(tempBillValue) + Number(tempBillValue) * Number(values.gst) / 100

                    useEffect(() => {
                        if (newRawMaterial === '') {
                            setRefetchRawMaterial(false)
                        }
                        else {
                            setNewRawMaterialAddError(null)
                        }
                    }, [newRawMaterial])
                    useEffect(() => {
                        if (newPartyAddedValue) {
                            setFieldValue('party', newPartyAddedValue)
                        }
                    }, [newPartyAddedValue])
                    useEffect(() => {
                        if (newRawMaterialAddedValue) {
                            setFieldValue('rawMaterial', newRawMaterialAddedValue)
                        }
                    }, [newRawMaterialAddedValue])
                    useEffect(() => {
                        setFieldValue("billValue", tempBillValue.toFixed(2));
                        setFieldValue("billAmount", tempBillAmount.toFixed(2));
                        setPlantId(String(values.plant))
                    }, [values.rate, values.weight, values.gst, newParty, values.plant])
                    useFocusEffect(
                        useCallback(() => {
                            resetForm()
                        }, [])
                    );
                    return (
                        (
                            <ScrollViewComponent gap={40}>
                                <PlantSelection />
                                <FormikTextInput name="billNumber" label="Bill number" width={300} />
                                <FormikTextInput name="weight" label="Weight in kg" width={300} keyboardType="numeric" />
                                <FormikTextInput name="rate" label="Rate" width={300} keyboardType="numeric" />
                                <FormikTextInput name="billValue" enabled={false} label="Bill value" width={300} />
                                <FormikDropdown width={300} label={"GST"} name="gst" items={gstData} placeholder={"Select GST"} />
                                <FormikTextInput name="billAmount" label='Bill amount' enabled={false} width={300} />
                                <FormikDateTimePicker width={300} name="date" />
                                <RawMaterialSelection refetchOnMount={refetchRawMaterial} />
                                <Center width={300} gap={10} direction={DIRECTION.Row}>
                                    <FloatingLabelInput error={newRawMaterialAddError} width={240} label="New raw material" value={newRawMaterial} setValue={setNewRawMaterial} />
                                    <Button label={t('add')} w={50} h={33} onPress={handleNewRawMaterialAdd} isLoading={isRawMaterialAddLoader} />
                                </Center>
                                <PartySelection refetchOnMount={refetchParty} />
                                <Center width={300} gap={10} direction={DIRECTION.Row}>
                                    <FloatingLabelInput error={newPartyAddError} width={240} label="New Party" value={newParty} setValue={setNewParty} />
                                    <Button label={t('add')} w={50} h={33} onPress={handleNewPartyAdd} isLoading={isPartyAddLoader} />
                                </Center>
                                <Button h={32} w={300} isLoading={isSubmitting && isLoading} onPress={handleSubmit} />
                                {
                                    error && <CustomText text={error} size={12} color={Colors.textErrorColor}/>
                                }
                            </ScrollViewComponent>
                        )
                    )
                }}
            </Formik>
        </>
    )
}
