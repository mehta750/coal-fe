import { useFocusEffect } from 'expo-router';
import { Formik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import * as yup from 'yup';
import { API, getFetchApi } from '../common/api';
import PlantSelection from '../common/PlantSelection';
import Button from '../componets/Button';
import Card from '../componets/Card';
import CustomText from '../componets/CustomText';
import FormikDropdown from '../componets/FormikDropdown';
import ReportCardList from '../componets/ReportCardList';
import ScrollViewComponent from '../componets/ScrollViewComponent';
import Space from '../componets/Space';

const reportTypeItems = [
  { label: 'Raw material', value: 'rawmaterial' },
  { label: 'Current outstanding', value: 'currentoutstanding' },
  { label: 'Challenges', value: 'challenges' },
  { label: 'Sale', value: 'sale' },
  { label: 'Cost', value: 'cost' },
]

const Reporting = () => {
  const [report, setReport] = useState(null)
  const [reportData,setReportData] = useState<any>()
  const handleReportDetails = async (values: any) => {
    const { plant, reportType } = values
    setReport(reportType)
    if(reportType === 'rawmaterial'){
      const rawMaterialQuantity: any = await getFetchApi(`${API.raw_material_quantity}?plantId=${plant}`)
      setReportData(rawMaterialQuantity?.data || rawMaterialQuantity.detail)
    }
    if(reportType === 'currentoutstanding'){
      const outstandingAmountResult: any = await getFetchApi(`${API.outstanding_party_amount}/${plant}`)
      setReportData(outstandingAmountResult.data || outstandingAmountResult.detail)
    }
  }
   
  const reportName = useMemo(() => {
   return reportTypeItems.find(
      (item) => item.value === report && item.label
    )?.label;
  }, [report])

  const schema = yup.object().shape({
    plant: yup.string().required('Plant required'),
    reportType: yup.string().required('Report type required')
  });

  const RenderContent = ({item}:{item: any}) => {
    return(
      <Card>
          <>
            <CustomText text={`Raw material quantity : ${item?.availableQuantity}`}/>
            <CustomText text={`Raw material name : ${item?.rawMaterial?.rawMaterialName}`}/>
          </>
      </Card>
    )
  }
  return (
    <View>
    <Formik
      initialValues={{ plant: '', reportType: '' }}
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        handleReportDetails(values)
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
            <FormikDropdown name="reportType" items={reportTypeItems} placeholder="Select report type" />
            <Space h={2} />
            <Button h={32} isLoading={isSubmitting} onPress={handleSubmit as any} />
          </ScrollViewComponent>
        )
      }}
    </Formik>
      {
       reportName && (
          <>
            <View style={{alignItems: 'center'}}><CustomText text={reportName} size={16}/></View>
            <Space h={6}/>
            <ReportCardList data={reportData} Content={RenderContent}  />
          </>
        )
      }
    </View>
  )
}

export default Reporting