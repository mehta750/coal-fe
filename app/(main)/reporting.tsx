import { useFocusEffect } from 'expo-router';
import { Formik } from 'formik';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as yup from 'yup';
import API, { getFetchApi } from '../common/api';
import PlantSelection from '../common/PlantSelection';
import Button from '../componets/Button';
import Card from '../componets/Card';
import Center, { DIRECTION } from '../componets/Center';
import CustomText from '../componets/CustomText';
import FormikDateTimePicker from '../componets/FormikDateTimePicker';
import FormikDropdown from '../componets/FormikDropdown';
import Header from '../componets/Header';
import Loader from '../componets/Loader';
import ReportCardList from '../componets/ReportCardList';
import ScrollViewComponent from '../componets/ScrollViewComponent';
import Space from '../componets/Space';
import { useAuth } from '../context/AuthContext';
import showToast from '../helper/toast';
import { fetchRoutes } from '../routes';

const reportTypeItems = [
  { label: 'Raw material', value: 'rawmaterial' },
  { label: 'Current outstanding', value: 'currentoutstanding' },
  { label: 'Open challenges', value: 'openchallenges' },
  { label: 'Close challenges', value: 'closechallenges' },
  { label: 'Sale', value: 'sale' },
  { label: 'Cost', value: 'cost' },
]

const Reporting = () => {
  const { authState } = useAuth()
  const role = authState?.role
  const isPartner = role?.includes('partner')
  const [report, setReport] = useState<string | null>(null)
  const [reportData, setReportData] = useState<any>(null)
  const [showDataField, setShowDateField] = useState(false)
  const [showList, setShowList] = useState(false)
  const [loader, setLoader] = useState(false)

  const reportName = useMemo(() => {
    return reportTypeItems.find(
      (item) => item.value === report && item.label
    )?.label || '';
  }, [report])

  const handleReportDetails = async (values: any) => {
    setLoader(true)
    const { plant, reportType, startDate, endDate } = values
    setReport(reportType)
    let result: any = null
    if (reportType === 'rawmaterial') {
      const rawMaterialQuantity: any = await getFetchApi(`${API.raw_material_quantity}?plantId=${plant}`)
      result = rawMaterialQuantity
    }
    else if (reportType === 'currentoutstanding') {
      const outstandingAmountResult: any = await getFetchApi(`${API.outstanding_party_amount}/${plant}`)
      result = outstandingAmountResult
    }
    else if (reportType === "openchallenges") {
      const openChallenges: any = await getFetchApi(`${API.challengesState}?plantId=${plant}`)
      result = openChallenges
    }
    else if (reportType === "closechallenges") {
      const closeChallengesData: any = await getFetchApi(`${API.challengesState}?plantId=${plant}&startDate=${startDate}&endDate=${endDate}`)
      result = closeChallengesData
    }
    else if (reportType === "sale") {
      const salesData: any = await getFetchApi(`${API.sales}?startDate=${startDate}&endDate=${endDate}&plantId=${plant}`)
      result = salesData
    }
    else if (reportType === "cost") {
      const costData: any = await getFetchApi(`${API.average_cost}?startDate=${startDate}&endDate=${endDate}&plantId=${plant}`)
      result = costData
    }
    
    if (result?.data) {
      setReportData(result.data)
    }
    else {
      setReportData([])
      showToast("error", "Error", (result || "something went wrong..."))
    }
    setLoader(false)
  }

  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    reportType: yup.string().required('Report type required')
  });

  const RenderContent = ({ item }: { item: any }) => {
    let content = <View />
    if (report === "rawmaterial") {
      content = renderCardValue('Raw material quantity', item?.availableQuantity, 'Raw material name', item?.rawMaterial?.rawMaterialName)
    }
    if (report === "currentoutstanding") {
      content = renderCardValue('Party name', item?.partyName, 'Amount', item?.amount)
    }
    if (report === "openchallenges") {
      content = renderCardValue('Challenges name', item?.challenge?.challengeName, 'Date', item?.challengeStartDateTime && moment(item.challengeStartDateTime).format("DD-MM-YYYY h:mm a"))
    }
    if (report === "closechallenges") {
      content = renderCardValue('Challenges name', item?.challenge?.challengeName, 'Date', item?.lastModifiedOn && moment(item.lastModifiedOn).format("DD-MM-YYYY h:mm a"))
    }
    if (report === "sale") {
      content = renderCardValue('Weight', item?.weight, 'Sale date', item?.saleDate && moment(item.saleDate).format("DD-MM-YYYY h:mm a"))
    }
    if (report === "cost") {
      content = renderCardValue('Raw material name', item?.rawMaterialName, 'Average cost', item?.averageCost)
    }
    return (
      <Card round={6}>
        {content}
      </Card>
    )
  }
  const datenow = new Date()
  const Routes: any = fetchRoutes()
  if (isPartner)
    return (
      <>
        <Header title={Routes.reporting} />
        <Center><CustomText text={"This is only for Admin"} /></Center>
      </>
    )
  return (
    <>
      <Header title={Routes.reporting} />
      <Formik
        initialValues={{ plant: '', reportType: '', startDate: datenow.toISOString(), endDate: datenow.toISOString() }}
        validationSchema={schema}
        onSubmit={(values, { resetForm }) => {
          handleReportDetails(values)
          setShowList(true)
          resetForm()
        }}
      >
        {({ handleSubmit, isSubmitting, resetForm, values }) => {
          useFocusEffect(
            useCallback(() => {
              resetForm()
              setReport(null)
            }, [])
          );
          useEffect(() => {
            if (values?.reportType) {
              setShowList(false)
            }
            if (values?.reportType === null) {
              setReport(null)
            }
            if (['closechallenges', 'sale', 'cost'].includes(values?.reportType)) {
              setReport(values?.reportType)
              setShowDateField(true)
            }
            else {
              setShowDateField(false)
            }
          }, [values?.reportType])
          return (
            <View style={{ flex: 1 }}>
              <View style={{  flex:  ["closechallenges", "sale", 'cost'].includes(report || '') && showDataField ? 1 : 0.7 }}>
                <ScrollViewComponent bottomPadding={0}>
                  <PlantSelection />
                  <FormikDropdown width={300} label={"Report type"} name="reportType" items={reportTypeItems} placeholder="Select report type" />
                  {
                    ["closechallenges", "sale", 'cost'].includes(report || '') && showDataField && (
                      <Center width={300} gap={10} direction={DIRECTION.Row}>
                        <FormikDateTimePicker label={"Start date"} width={145} name={'startDate'} />
                        <FormikDateTimePicker label={"End date"} width={145} name={'endDate'} />
                      </Center>
                    )
                  }
                  <Button h={32} size={16} isLoading={isSubmitting} onPress={handleSubmit as any} />
                </ScrollViewComponent>
              </View>
              <View style={{ flex: 1 }}>
                {
                  loader ? <Loader /> :
                    <RenderData
                      reportName={reportName}
                      showList={showList}
                      reportData={reportData}
                      RenderContent={RenderContent}
                    />}
              </View>
            </View>
          )
        }}
      </Formik>
    </>
  )
}
const RenderData = ({ reportName, showList, reportData, RenderContent }: { reportName: any, showList: any, reportData: any, RenderContent: any }) => {
  if (reportName && showList) {
    return (
      <>
        <CustomText center text={reportName} size={18} />
        <Space h={5}/>
        {
          reportData?.length !== 0 ? <ReportCardList data={reportData} Content={RenderContent} /> : (
            <CustomText size={16} center text={'No data'} />
          )
        }

      </>
    )
  }
  return null
}

const renderCardValue = (label1: string, value1: string | null | number, label2: string, value2: string | null | number) => (
  <>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <CustomText size={16} text={`${label1} : `} />
      <CustomText weight={'700'} size={16} text={value1} />
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <CustomText size={16} text={`${label2} : `} />
      <CustomText weight={'700'} size={16} text={value2} />
    </View>
  </>
)

export default Reporting