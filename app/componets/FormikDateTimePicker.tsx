import DateTimePicker from '@react-native-community/datetimepicker';
import { useField } from 'formik';
import moment from 'moment';
import React, { memo, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant';
import CustomText from './CustomText';

interface DatePickerProps {
    name: string
    width?: number
    height?: number
    round?: number
    mode?: 'date' | 'time' | 'datetime'
    display?: 'default' | 'spinner'
    label?: string | null 
}

const FormikDateTimePicker = (props: DatePickerProps) => {
    const { name, width = 250, height = 36, round = 0, mode = 'date', display = 'spinner', label= 'Date' } = props
    const [show, setShow] = useState(false);
    const [field, meta, helpers] = useField(name);

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate: any = selectedDate || field.value;
        setShow(Platform.OS === 'ios'); // iOS keeps the picker open
        helpers.setValue(currentDate.toISOString());
    };
    const handlePress = () => {
        setShow(!show)
    }
    return (
        <View style={{gap: 5}}>
             {label && field.value && <CustomText size={12} text={label}/>}
            <Pressable
                onPressIn={handlePress}
                style={{
                    height: verticalScale(height),
                    borderWidth: 1,
                    borderColor: meta.touched && meta.error ? Colors.textErrorColor : 'lightgrey',
                    width: scale(width),
                    paddingHorizontal: moderateScale(12),
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: moderateScale(round),
                    backgroundColor: "white"
                }}>
                <CustomText
                    color={field.value ? Colors.textBlackColor : Colors.secondaryButtonColor}
                    size={13}
                    text={field.value
                        ? moment(field.value).format(
                            mode === 'date'
                                ? 'YYYY-MM-DD'
                                : mode === 'time'
                                    ? 'hh:mm A'
                                    : 'YYYY-MM-DD hh:mm A'
                        )
                        : `Select ${mode}`} />
            </Pressable>
            {
                (show && Platform.OS === 'ios') && (
                    <Modal
                        isVisible={show}
                        onBackdropPress={() => setShow(false)}
                        style={{ alignItems: 'center' }}
                    >
                        {datePicker(display, field.value ? new Date(field.value) : new Date(), onChange, mode)}
                    </Modal>

                )
            }
            {
                (show && Platform.OS === 'android') && (
                    datePicker(display, field.value ? new Date(field.value) : new Date(), onChange, mode)
                )
            }
        </View>
    );
}

const datePicker = (display: 'default' | 'spinner', date: any, onChange: any, mode: 'date' | 'time' | 'datetime') => {
    return <DateTimePicker
        style={{ backgroundColor: Colors.textWhiteColor }}
        display={display}
        maximumDate={new Date()}
        value={date}
        mode={mode}
        onChange={onChange}
        textColor={Colors.primaryButtonColor}
    />
}

export default memo(FormikDateTimePicker)
