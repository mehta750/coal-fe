import React, { useEffect, useState } from 'react';
import API, { getFetchApi } from '../common/api';
import RawMaterialSelection from '../common/RawMaterialSelection';
import CustomText from '../componets/CustomText';
import FormikTextInput from '../componets/FormikTextInput';
import { Colors } from '../constant';
import { createEmptyMaterialRow, getTotalPercentage, isDuplicateRawMaterial } from '../utils/sales';
import Loader from './Loader';

const TOTAL_PERCENTAGE = 100;

const RenderRawMaterials = (props: any) => {
    const { data, setFieldValue, weight, item, plant, index } = props
    const [rawMaterialQuantityLoader,setRawMaterialQuantityLoader] = useState(false)
    let tempData = [...data];
    useEffect(() => {
        const updateData = async () => {
            setRawMaterialQuantityLoader(true)
            const duplicate = isDuplicateRawMaterial(tempData, index);
            tempData[index].dublicateRMError = duplicate ? 'Raw material already selected' : null;

            if (item.rawMaterial && !duplicate && plant) {
                const res: any = await getFetchApi(`${API.raw_material_quantity}?rawMaterialId=${item.rawMaterial}&plantId=${plant}`);
                const quantity = res?.data?.[0]?.availableQuantity || 0;
                tempData[index].rawMaterialAvailableQuantity = quantity;
            } else {
                tempData[index].rawMaterialAvailableQuantity = null;
            }

            setFieldValue('data', tempData);
            setRawMaterialQuantityLoader(false)
        };

        updateData();
    }, [item.rawMaterial, plant]);

    useEffect(() => {
        let error = null;
        if ((!weight || weight === '0') || !plant) {
            setFieldValue('data', [createEmptyMaterialRow()]);
            return;
          } 
                 
        if (item.productPercentage === '') {
            const errorIndex = tempData.findIndex((item) => item.productPercentage === '');
            const result = errorIndex === -1 ? tempData : tempData.slice(0, errorIndex + 1);
            setFieldValue('data', result);
            return
        }
        else if (!item.rawMaterial || item.rawMaterial === '') {
            const errorIndex = tempData.findIndex((item) => item.rawMaterial === '' || !item.rawMaterial);
            const result = errorIndex === -1 ? tempData : tempData.slice(0, errorIndex + 1);
            result[index].productPercentage = ''
            setFieldValue('data', result);
            return
        }
        else if ((item.productPercentage !== '' && Number(item.productPercentage) === 0) || Number(item.productPercentage) > 100) {
            tempData[index].error = "Not valid entry"
            const errorIndex = tempData.findIndex((item) => item.error !== '');
            const result = errorIndex === -1 ? tempData : tempData.slice(0, errorIndex + 1);
            setFieldValue('data', result);
            return
        }
        else {
            tempData[index].error = null
        }
        if (weight && item.productPercentage && item.rawMaterialAvailableQuantity !== null) {
            const used = Number(weight) * Number(item.productPercentage) * 0.01;
            if (used > item.rawMaterialAvailableQuantity) {
                tempData[index].error = 'Used quantity exceeds available stock'
                const errorIndex = tempData.findIndex((item) => item.error !== '');
                const result = errorIndex === -1 ? tempData : tempData.slice(0, errorIndex + 1);
                setFieldValue('data', result);
                return
            }
            else {
                tempData[index].error = null
            }
        }

        tempData[index].error = error;
        const isFilled = item.rawMaterial && item.productPercentage;
        const total = getTotalPercentage(tempData);
        const isLast = index === tempData.length - 1;

        if (!error) {
            if (isLast && isFilled && total < TOTAL_PERCENTAGE && !tempData[index].dublicateRMError) {
                tempData.push(createEmptyMaterialRow());
            } else if (total === TOTAL_PERCENTAGE) {
                tempData = tempData.filter(d => d.rawMaterial !== '' || Number(d.productPercentage) > 0);
            }
        }
        setFieldValue('data', tempData);
    }, [item.productPercentage, weight, item.rawMaterial, plant]);

    return (
        <>
            <RawMaterialSelection name={`data[${index}].rawMaterial`} />
            {item.dublicateRMError && <CustomText color={Colors.textErrorColor} size={12} text={item.dublicateRMError} />}
            <RenderRawMaterialQuantity loader={rawMaterialQuantityLoader} data={item.rawMaterialAvailableQuantity}/>
            <FormikTextInput
                enabled={!item.dublicateRMError}
                keyboardType="numeric"
                name={`data[${index}].productPercentage`}
                label="% in product"
                width={300}
            />
            {item.error && <CustomText color={Colors.textErrorColor} size={11} text={item.error} />}
        </>
    );
};


const RenderRawMaterialQuantity = ({loader, data}:{loader: boolean,data: any}) => {
  if(loader)
    return <Loader size='small'/>
  if(data || data === 0){
    return <CustomText size={12} color={Colors.textBlackColor} text={`Available raw material quantity:${data}`} />
  }
  return null
}
export default RenderRawMaterials
