import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as yup from 'yup';
import API, { getFetchApi } from "../common/api";
import PartySelection from "../common/PartySelection";
import PlantSelection from "../common/PlantSelection";
import RawMaterialSelection from "../common/RawMaterialSelection";
import Button from "../componets/Button";
import Center, { DIRECTION } from "../componets/Center";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikDropdown from "../componets/FormikDropdown";
import FormikTextInput from "../componets/FormikTextInput";
import Header from "../componets/Header";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import FloatingLabelInput from '../componets/TextInput';
import { useAuth } from "../context/AuthContext";
import { usePostApi } from "../helper/api";
import showToast from "../helper/toast";
import { useLocalisation } from "../locales/localisationContext";
import { fetchRoutes } from "../routes";

export default function RawMaterial() {
    const { post, isLoading, error } = usePostApi()
    const { authState } = useAuth()
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
    const [plantId, setPlantId] = useState("")
    const [parties, setParties] = useState<{ label: string, value: number | string }[] | null>(null)
    const [isPartyAddLoader, setPartyAddLoader] = useState(false)
    const [newPartyAddError, setNewPartyAddError] = useState<string | null>(null)
    const [newPartyAddedValue, setNewPartyAddedValue] = useState<string | number | null>(null)

    useEffect(() => {
        setNewPartyAddError(null)
    }, [newParty])
    const handleNewPartyAdd = async () => {
        if (newParty === '') {
            setNewPartyAddError("Please enter party name")
            return
        }
        if(plantId === ''){
            setNewPartyAddError("Please select plant")
            return
        }
        setPartyAddLoader(true)
        const p = await post(API.partyURL, { partyName: newParty, plantId })
        setNewPartyAddedValue(p.partyId)
        const userInformationResult: any = await getFetchApi(API.user_information_url)
        const parties: any = userInformationResult?.data?.assignedPlant.flatMap((plant: any) =>
            plant.parties.map((party: any) => ({
                value: party.partyId,
                label: party.partyName,
            }))
        );
        setParties(parties)
        showToast("info", "Added", '')
        setNewParty("")
        setPartyAddLoader(false)

    }
    const { t } = useLocalisation()
    const Routes: any=fetchRoutes()
    return (
        <>
        <Header title={Routes.rawMaterial}/>
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
                    if(newPartyAddedValue && isPartner){
                        setFieldValue('party', newPartyAddedValue)
                    }
                },[newPartyAddedValue])
                useEffect(() => {
                    setFieldValue("billValue", tempBillValue.toFixed(2));
                    setFieldValue("billAmount", tempBillAmount.toFixed(2));
                    setPlantId(String(values.plant))
                }, [values.rate, values.weight, values.gst, newParty])
                useFocusEffect(
                    useCallback(() => {
                        resetForm()
                    }, [])
                );
                return (
                    (
                        <ScrollViewComponent gap={30}>
                            <PlantSelection />
                            <FormikTextInput name="billNumber" label="Bill number" width={250} />
                            <FormikTextInput name="weight" label="Weight in kg" width={250} keyboardType="numeric" />
                            <FormikTextInput name="rate" label="Rate" width={250} keyboardType="numeric" />
                            <FormikTextInput name="billValue" enabled={false} label="Bill value" width={250} />
                            <FormikDropdown label={"GST"} name="gst" items={gstData} placeholder={"Select GST"} />
                            <FormikTextInput name="billAmount" label='Bill amount' enabled={false} width={250} />
                            <FormikDateTimePicker name="date" />
                            <RawMaterialSelection />
                            <PartySelection partiesData={parties} />
                            {
                                isPartner && (
                                    <Center width={150} gap={10} direction={DIRECTION.Row}>
                                        <FloatingLabelInput error={newPartyAddError} width={190} label="New Party" value={newParty} setValue={setNewParty} />
                                        <Button label={t('add')} w={50} h={33} onPress={handleNewPartyAdd} isLoading={isPartyAddLoader} />
                                    </Center>
                                )
                            }
                            <Space h={6} />
                            <Button h={32} isLoading={isSubmitting && isLoading} onPress={handleSubmit} />
                        </ScrollViewComponent>
                    )
                )
            }}
        </Formik>
        </>
    )
}
