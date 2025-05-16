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
import ReportCardList from '../componets/ReportCardList';
import ScrollViewComponent from '../componets/ScrollViewComponent';
import Space from '../componets/Space';
import { useAuth } from '../context/AuthContext';
import showToast from '../helper/toast';

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

  const reportName = useMemo(() => {
    return reportTypeItems.find(
      (item) => item.value === report && item.label
    )?.label || '';
  }, [report])

  const handleReportDetails = async (values: any) => {
    const { plant, reportType, startDate, endDate } = values
    setReport(reportType)
    let result
    if (reportType === 'rawmaterial') {
      const rawMaterialQuantity: any = await getFetchApi(`${API.raw_material_quantity}?plantId=${plant}`)
      result = rawMaterialQuantity
    }
    if (reportType === 'currentoutstanding') {
      const outstandingAmountResult: any = await getFetchApi(`${API.outstanding_party_amount}/${plant}`)
      result = outstandingAmountResult
    }
    if (reportType === "openchallenges") {
      const openChallenges: any = await getFetchApi(`${API.challengesState}?plantId=${plant}`)
      result = openChallenges
    }
    if (reportType === "closechallenges") {
      const closeChallengesData: any = await getFetchApi(`${API.challengesState}?plantId=${plant}&startDate=${startDate}&endDate=${endDate}`)
      result = closeChallengesData
    }
    if (reportType === "sale") {
      const salesData: any = await getFetchApi(`${API.sales}?startDate=${startDate}&endDate=${endDate}&plantId=${plant}`)
      result = salesData
    }
    if (reportType === "cost") {
      const costData: any = await getFetchApi(`${API.average_cost}?startDate=${startDate}&endDate=${endDate}&plantId=${plant}`)
      result = costData
    }
    if (result?.data) {
      setReportData(result.data)
    }
    else {
      setReportData([])
      showToast("error", "Error", (result?.data?.detail || "something went wrong..."))
    }
  }

  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    reportType: yup.string().required('Report type required')
  });

  const RenderContent = ({ item }: { item: any }) => {
    let content = <View />
    if (report === "rawmaterial") {
      content = (
        <>
          <CustomText text={`Raw material quantity : ${item?.availableQuantity}`} />
          <CustomText text={`Raw material name : ${item?.rawMaterial?.rawMaterialName}`} />
        </>
      )
    }
    if (report === "currentoutstanding") {
      content = (
        <>
          <CustomText text={`Party name : ${item?.partyName}`} />
          <CustomText text={`amount : ${item?.amount}`} />
        </>
      )
    }
    if (report === "openchallenges") {
      content = (
        <>
          <CustomText text={`Challenges name : ${item?.challenge?.challengeName}`} />
          <CustomText size={11} text={`Date : ${item?.challengeStartDateTime && moment(item.challengeStartDateTime).format("DD-MM-YYYY h:mm a")}`} />
        </>
      )
    }
    if (report === "closechallenges") {
      content = (
        <>
          <CustomText text={`Challenges name : ${item?.challenge?.challengeName}`} />
          <CustomText size={11} text={`Date : ${item?.lastModifiedOn && moment(item.lastModifiedOn).format("DD-MM-YYYY h:mm a")}`} />
        </>
      )
    }
    if (report === "sale") {
      content = (
        <>
          <CustomText text={`Weight : ${item?.weight}`} />
          <CustomText size={11} text={`Sale date : ${item?.saleDate && moment(item.saleDate).format("DD-MM-YYYY h:mm a")}`} />
        </>
      )
    }
    if (report === "cost") {
      content = (
        <>
          <CustomText text={`Raw material name : ${item?.rawMaterialName}`} />
          <CustomText text={`Average cost : ${item?.averageCost}`} />
        </>
      )
    }
    return (
      <Card round={6}>
        {content}
      </Card>
    )
  }
  const datenow = new Date()
  if (isPartner) return <Center><CustomText text={"This is only for Admin"} /></Center>
  return (
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
          <>
            <View>
              <ScrollViewComponent>
                <PlantSelection />
                <FormikDropdown name="reportType" items={reportTypeItems} placeholder="Select report type" />
                {
                  ["closechallenges", "sale", 'cost'].includes(report || '') && showDataField && (
                    <Center width={150} gap={10} direction={DIRECTION.Row}>
                      <View style={{ gap: 5 }}>
                        <CustomText text={"Start date"} size={14} />
                        <FormikDateTimePicker width={120} name={'startDate'} />
                      </View>
                      <View style={{ gap: 5 }}>
                        <CustomText text={"End date"} size={14} />
                        <FormikDateTimePicker width={120} name={'endDate'} />
                      </View>
                    </Center>
                  )
                }
                <Space h={2} />
                <Button h={32} isLoading={isSubmitting} onPress={handleSubmit as any} />
              </ScrollViewComponent>
            </View>
            {
              reportName && showList && (
                <>
                  <CustomText center text={reportName} size={16} />
                  {
                    reportData?.length !== 0 ? <ReportCardList data={reportData} Content={RenderContent} /> : (
                      <CustomText center text={'No data'} />
                    )
                  }

                </>
              )
            }
          </>
        )
      }}
    </Formik>
  )
}

export default Reporting