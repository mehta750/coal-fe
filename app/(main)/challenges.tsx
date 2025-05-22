import axios from "axios";
import { useFocusEffect } from "expo-router";
import { Formik } from "formik";
import moment from "moment";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import * as yup from 'yup';
import API, { getFetchApi, postAPI } from "../common/api";
import PlantSelection from "../common/PlantSelection";
import Button from "../componets/Button";
import Card from "../componets/Card";
import Center, { DIRECTION } from "../componets/Center";
import CustomText from "../componets/CustomText";
import FormikDateTimePicker from "../componets/FormikDateTimePicker";
import FormikDropdown from "../componets/FormikDropdown";
import Header from "../componets/Header";
import Loader from "../componets/Loader";
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
  const { authState } = useAuth();
  const role = authState?.role;
  const isPartner = role?.includes('partner');
  const plants = authState?.plants || [];

  const challengesData: any = useGetApi(API.challenges);
  const challengesStateResult: any = useGetApi(API.challengesState);

  const { post, isLoading, error } = usePostApi();
  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    challenge: yup.string().required('Challenge required'),
  });

  const challengeOptions = challengesData?.data?.map((ch: any) => ({
    label: ch.challengeName,
    value: ch.challengeId
  })) as any;

  const [newChallenge, setNewChallenge] = useState("");
  const [newChallengeAddError, setNewChallengeAddError] = useState<string | null>(null);
  const [isChallengeAddLoader, setIsChallengeAddLoader] = useState(false);
  const [challengeOptionsState, setChallengeOptionsState] = useState(null);
  const [isChallengeResolveLoader, setIsChallengeResolveLoader] = useState(false);
  const [challengeStateDataState, setChallengeStateDataState] = useState(null);
  const [challengeId, setChallengeId] = useState<number>();
  const [newChallengeId, setNewChallengeId] = useState<number | string | null>(null);

  const { t } = useLocalisation() as any;
  const Routes: any = fetchRoutes();

  const handleResolve = useCallback(async (id: number) => {
    setChallengeId(id);
    try {
      setIsChallengeResolveLoader(true);
      await axios.put(`${API.closeChallengeState}/${id}`);
      const closeChallengeStateData = await getFetchApi(API.challengesState) as any;
      if (!closeChallengeStateData?.data) showToast("error", "Error", "Facing issue to resolve this");
      setChallengeStateDataState(closeChallengeStateData?.data);
    } catch (error: any) {
      showToast("error", "Error", error.response?.data?.detail || error?.response?.data.title || "Facing issue to resolve this");
    } finally {
      setIsChallengeResolveLoader(false);
    }
  }, []);

  const renderChallenges = () => {
    if (challengesStateResult?.isLoading) {
      return <Loader />
    }

    if (challengesStateResult?.error) {
      return <CustomText size={16} text={"We are facing issue to display challenges"} />
    }

    const activeChallenges = (challengeStateDataState || challengesStateResult?.data)
      ?.filter((challenge: any) => challenge.state);

    if (!activeChallenges || activeChallenges.length === 0) {
      return <CustomText size={16} text={"No open challenges"} />
    }

    return activeChallenges.map((challenge: any, index: number) => {
      const challengeOpenDate = moment(challenge?.challengeStartDateTime).format('DD-MM-YYYY h:mm a');
      return (
        <Fragment key={index}>
          <Card round={6}>
            <View style={{ gap: scale(10), width: '100%' }}>
              <View style={{ flexDirection: 'row' }}>
                <CustomText color={Colors.primaryButtonColor} size={14} text={`Open date : `} />
                <CustomText weight={"700"} color={Colors.primaryButtonColor} size={14} text={challengeOpenDate} />
              </View>
              <CustomText size={16} text={challenge?.challenge.challengeName} />
              <Space h={10}/>
              <View style={{alignItems: 'flex-end'}}>
                {
                  (isChallengeResolveLoader && (challengeId === challenge?.challengesStateId)) ? (
                    <Loader size="small"/>
                  ) : (
                    <Pressable style={{paddingVertical: moderateScale(3),paddingHorizontal: moderateScale(5),borderWidth: 0.7, borderColor: Colors.primaryButtonColor, borderRadius: scale(10)}} onPress={() => handleResolve(challenge?.challengesStateId) as any}>
                      <CustomText color={Colors.primaryButtonColor} size={12} text={t('resolve') || 'Resolve'} />
                    </Pressable>
                  )
                }
                </View>
            </View>
          </Card>
          <Space />
        </Fragment>
      );
    });
  };

  const handleAddNewChallenge = async () => {
    if (newChallenge === '') {
      setNewChallengeAddError('Please enter your challenge');
      return;
    }
    if (newChallenge.length > 1000) {
      setNewChallengeAddError('Max 1000 chars allowed');
      return;
    }
    setIsChallengeAddLoader(true);
    const ch: any = await postAPI(API.challenges, { challengeName: newChallenge });
    if (ch?.data)
      setNewChallengeId(ch?.data?.challengeId);
    else {
      setNewChallengeAddError(ch)
      setIsChallengeAddLoader(false)
      return
    }

    const result = await getFetchApi(API.challenges) as any;
    if (result?.data) {
      const addedChallengeData = result?.data.map((ch: any) => ({
        label: ch.challengeName,
        value: ch.challengeId
      }));
      setChallengeOptionsState(addedChallengeData);
      showToast("info", "Added", '');
      setNewChallenge("");
    } else {
      showToast("error", "Error", result?.data?.detail || "Something went wrong");
    }
    setIsChallengeAddLoader(false);
  };

  useEffect(() => {
    if (newChallenge !== '') {
      setNewChallengeAddError(null);
    }
  }, [newChallenge]);

  return (
    <>
      <Header title={Routes.challenges} />
      <ScrollViewComponent gap={0}>
        <Formik
          initialValues={{
            plant: isPartner ? plants[0].value : '',
            challenge: '',
            newChallenge: '',
            date: new Date()
          }}
          validationSchema={schema}
          onSubmit={async (values, { resetForm }) => {
            const { plant, challenge, date } = values;
            const payload = {
              plantId: plant,
              challengeId: challenge,
              challengeStartDateTime: date
            };
            const { state } = await post(API.challengesState, payload);
            if (state) {
              const updated = await getFetchApi(API.challengesState) as any;
              if (!updated?.data) showToast("error", "Facing issue to resolve this", "");
              setChallengeStateDataState(updated?.data);
            }
            resetForm();
          }}
        >
          {({ handleSubmit, isSubmitting, resetForm, setFieldValue }) => {
            useFocusEffect(
              useCallback(() => {
                resetForm();
                challengesData?.refetch()
                challengesStateResult?.refetch()
                setChallengeStateDataState(null);
              }, [])
            );

            useEffect(() => {
              if (newChallengeId) {
                setFieldValue('challenge', newChallengeId);
              }
            }, [newChallengeId]);

            return (
              <ScrollViewComponent gap={30}>
                <PlantSelection />
                <FormikDropdown
                  width={300}
                  label={"Challenge"}
                  name="challenge"
                  items={challengeOptionsState || challengeOptions}
                  placeholder="Select a challenge"
                />
                <Center width={300} gap={10} direction={DIRECTION.Row}>
                  <FloatingLabelInput
                    error={newChallengeAddError}
                    width={240}
                    label="New challenge"
                    value={newChallenge}
                    setValue={setNewChallenge}
                  />
                  <Button
                    label={t('add')}
                    w={50}
                    h={33}
                    onPress={handleAddNewChallenge}
                    isLoading={isChallengeAddLoader}
                  />
                </Center>
                <FormikDateTimePicker width={300} name="date" mode="datetime" />
                <Button size={16} w={300} h={32} onPress={handleSubmit as any} isLoading={isSubmitting && isLoading} />
                {
                  error && <CustomText size={12} color={Colors.textErrorColor} text={error} />
                }
              </ScrollViewComponent>
            );
          }}
        </Formik>
        <CustomText text={"Open challenges"} size={18} weight={500} />
        <Space />
        {renderChallenges()}
      </ScrollViewComponent>
    </>
  );
}
