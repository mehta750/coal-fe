import axios from "axios";
import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import moment from "moment";
import { Fragment, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import * as yup from 'yup';
import API, { getFetchApi } from "../common/api";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import Card from "../componets/Card";
import Center, { DIRECTION } from "../componets/Center";
import CustomText from "../componets/CustomText";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikDropdown from "../componets/FormikDropdown";
import Header from "../componets/Header";
import ScrollViewComponent from "../componets/ScrollViewComponent";
import Space from "../componets/Space";
import FloatingLabelInput from '../componets/TextInput';
import { Colors } from "../constant";
import { useAuth } from "../context/AuthContext";
import { useGetApi, usePostApi } from "../helper/api";
import showToast from "../helper/toast";
import { useLocalisation } from "../locales/localisationContext";
import { fetchRoutes } from "../routes";

export default function Challenges() {
    const { authState } = useAuth()
    const role = authState?.role
    const isPartner = role?.includes('partner')
    const plants = authState?.plants || []
    const challengesData: any = useGetApi(API.challenges)
    const challengesStateResult: any = useGetApi(API.challengesState)

    const { post, isLoading } = usePostApi()
    const schema = yup.object().shape({
        plant: yup.string().required('Plant required'),
        challenge: yup.string().required('Challenge required'),
    });
    const challengeOptions = challengesData?.data?.map((ch: any) => ({ label: ch.challengeName, value: ch.challengeId })) as any
    const [newChallenge, setNewChallenge] = useState("")
    const [newChallengeAddError, setNewChallengeAddError] = useState<string | null>(null)
    const [isChallengeAddLoader, setIsChallengeAddLoader] = useState(false)
    const [challengeOptionsState, setChallengeOptionsState] = useState(null)
    const [isChallengeResolveLoader, setIsChallengeResolveLoader] = useState(false)
    const [challengeStateDataState, setChallengeStateDataState] = useState(null)
    const [challengeId, setChallengeId] = useState<number>()
    const [newChallengeId, setNewChallengeId] = useState<number | string | null>(null)

    const handleResolve = useCallback(async (id: number) => {
        setChallengeId(id)
        try {
            setIsChallengeResolveLoader(true)
            await axios.put(`${API.closeChallengeState}/${id}`)
            const closeChallengeStateData = await getFetchApi(API.challengesState) as any
            if (!closeChallengeStateData?.data) showToast("error", "Error", "Facing issue to resolve this")
            setChallengeStateDataState(closeChallengeStateData?.data)

        } catch (error: any) {
            showToast("error", "Error", error.response.data.detail || "Facing issue to resolve this")
        }
        finally {
            setIsChallengeResolveLoader(false)
        }
    }, [])


    const renderChallenges = () => {

        if (challengesStateResult?.isLoading) {
            return <Card isTextCenter><ActivityIndicator size={'large'} /></Card>
        }
        if (challengesStateResult?.error) {
            return <Card isTextCenter><CustomText text={"We are facing issue to display challenges"} /></Card>
        }
        if (!challengesStateResult?.data || challengesStateResult?.data.length === 0) {
            return <Card isTextCenter><CustomText text={"No Challenges"} /></Card>
        }
        return (challengeStateDataState || challengesStateResult?.data)?.map((challenge: any, index: number) => {
            const isResolved = !challenge.state
            const challengeOpenDate = challenge?.createdOn
            const challengeCloseDate = challenge?.lastModifiedOn
            const challengeOpenDateMoment = challengeOpenDate && moment(challengeOpenDate).format('DD-MM-YYYY h:mm a');
            const challengeCloseDateMoment = challengeCloseDate && moment(challengeCloseDate).format('DD-MM-YYYY h:mm a');
            return (
                <Fragment key={index}>
                    <Card h={100}>
                        <>
                            <TextInput
                                value={challenge?.challenge.challengeName}
                                editable={false}
                                multiline
                                numberOfLines={4}
                                placeholder="Wait for challenges"
                                textAlignVertical="top"
                            />
                            {
                                isResolved ? (
                                    <View style={{ position: 'absolute', bottom: verticalScale(5), left: scale(10) }}>
                                        <CustomText color={Colors.secondaryButtonColor} size={9} text={`Open date: ${challengeOpenDateMoment}`} />
                                        <CustomText color={Colors.secondaryButtonColor} size={9} text={`Close date: ${challengeCloseDateMoment}`} />
                                    </View>
                                ) : (
                                    <View style={{ position: 'absolute', bottom: verticalScale(5), left: scale(10) }}>
                                        <CustomText color={Colors.secondaryButtonColor} size={9} text={`Open date: ${challengeOpenDateMoment}`} />
                                    </View>
                                )
                            }

                            <Pressable style={{ position: 'absolute', right: moderateScale(10), bottom: moderateScale(10) }}>
                                <Button isLoading={!isResolved && isChallengeResolveLoader && (challengeId === challenge?.challengesStateId)} onPress={() => handleResolve(challenge?.challengesStateId) as any} disabled={isResolved} color={isResolved ? "#676765" : "#fff"} bg={isResolved ? Colors.secondaryButtonColor : Colors.primaryButtonColor} round={isResolved ? 10 : 0} size={10} w={60} label={isResolved ? t('close') : t('resolve')} />
                            </Pressable>
                        </>
                    </Card>
                </Fragment>
            )
        })
    }

    const handleAddNewChallenge = async () => {
        if(newChallenge === ''){
            setNewChallengeAddError('Please enter your challenge')
            return
        }
        setIsChallengeAddLoader(true)
        const ch = await post(API.challenges, { challengeName: newChallenge })
        setNewChallengeId(ch?.challengeId)
        const result = await getFetchApi(API.challenges) as any
        if (result?.data) {
            const addedChallengeData = result?.data.map((ch: any) => ({ label: ch.challengeName, value: ch.challengeId }))
            setChallengeOptionsState(addedChallengeData)
            showToast("info", "Added", '')
            setNewChallenge("")
        }
        else showToast("error", "Error", result?.data?.detail || "Somethig went wrong")
        setIsChallengeAddLoader(false)

    }
    useEffect(()=>{
        if(newChallenge !== ''){
            setNewChallengeAddError(null)
        }
    },[newChallenge])
    const { t } = useLocalisation()
     const Routes: any = fetchRoutes()
    return (
        <>
         <Header title={Routes.challenges}/>
        <ScrollViewComponent gap={8}>
            <Formik
                initialValues={{ plant: isPartner ? plants[0].value : '', challenge: '', newChallenge: '', date: new Date() }}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                    const { plant, challenge, date } = values
                    const payload = {
                        plantId: plant,
                        challengeId: challenge,
                        challengeStartDateTime: date
                    }
                    const { state } = await post(API.challengesState, payload)
                    if (state) {
                        const closeChallengeStateData = await getFetchApi(API.challengesState) as any
                        if (!closeChallengeStateData?.data) showToast("error", "Facing issue to resolve this", "")
                        setChallengeStateDataState(closeChallengeStateData?.data)
                    }
                    resetForm()
                }}
            >
                {({ handleSubmit, isSubmitting, resetForm, setFieldValue }) => {
                    useFocusEffect(
                        useCallback(() => {
                            resetForm()
                        }, [])
                    );
                    useEffect(()=>{
                        if(newChallengeId){
                            setFieldValue('challenge', newChallengeId)
                        }
                    },[newChallengeId])
                    return (
                        <ScrollViewComponent>
                            <PlantSelection />
                            <FormikDropdown label={"Challenge"} name="challenge" items={challengeOptionsState || challengeOptions} placeholder="Select a challenge" />
                            <Center width={150} gap={10} direction={DIRECTION.Row}>
                                <FloatingLabelInput error={newChallengeAddError} width={190} label="New challenge" value={newChallenge} setValue={setNewChallenge} />
                                <Button label={t('add')} w={50} h={33} onPress={handleAddNewChallenge} isLoading={isChallengeAddLoader} />
                            </Center>
                            <FormikDateTimePicker name="date" />
                            <Space h={6} />
                            <Button h={32} onPress={handleSubmit as any} isLoading={isSubmitting && isLoading} />
                        </ScrollViewComponent>
                    )
                }}
            </Formik>
            <CustomText text={"Challenges"} size={16} weight={500} />
            {renderChallenges()}
        </ScrollViewComponent>
        </>
    )
}
