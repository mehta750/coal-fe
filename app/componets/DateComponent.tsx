import DateTimePicker from '@react-native-community/datetimepicker';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant';
import CustomText from './CustomText';

export enum Mode {
  DATE="date",
  DATETIME="datetime",
  TIME="time"
}

interface DatePickerProps {
  value: Date
  setValue: Dispatch<SetStateAction<Date>>
  width?: number
  height?: number
  round?: number
  mode?: Mode
}

const DatePicker = (props: DatePickerProps) => {
  const {value, setValue, width=250, height=36, round=0, mode=Mode.DATE} = props
  // const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);


  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate: any = selectedDate || value;
    setShow(Platform.OS === 'ios'); // iOS keeps the picker open
    // setDate(currentDate);
    setValue(currentDate)
  };

  const handlePress = () => {
    setShow(!show)
  }
  return (
    <View>
      <Pressable 
      onPressIn={handlePress} 
        style={{
          height: verticalScale(height),
          borderWidth: 1, 
          borderColor: 'lightgrey',
          width: scale(width),
          paddingHorizontal: moderateScale(12),
          justifyContent:'center',
          alignContent:'center',
          borderRadius: moderateScale(round),
          backgroundColor: "white"
          }}>
            <CustomText size={13} text={mode === Mode.DATETIME ? value?.toLocaleString(): value?.toLocaleDateString()}/>
      </Pressable>
      {
       ( show && Platform.OS === 'ios') && (
          <Modal
            isVisible={show}
            onBackdropPress={() => setShow(false)}
            style={{alignItems:'center'}}
          >
          {datePicker(value, onChange, mode)} 
          </Modal>

        )
      }
      {
        ( show && Platform.OS === 'android') && (
          datePicker(value, onChange, mode)
        )
      }
    </View>
  );
}

const datePicker = (date : any, onChange: any, mode: Mode) => {
  return  <DateTimePicker
      style={{backgroundColor: Colors.textWhiteColor}}
      display={"spinner"}
      maximumDate={new Date()} 
      value={date}
      mode={mode}
      onChange={onChange}
      textColor={Colors.primaryButtonColor}
    />
}

export default DatePicker
