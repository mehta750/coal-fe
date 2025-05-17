import { useField } from 'formik';
import moment from 'moment';
import React, { memo, useState } from 'react';
import { Pressable, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant';
import RenderLabel from '../utils/renderLabel';
import CustomText from './CustomText';

interface DatePickerProps {
  name: string;
  width?: number;
  height?: number;
  round?: number;
  mode?: 'date' | 'time' | 'datetime';
  label?: string | null;
}

const FormikDateTimePicker = (props: DatePickerProps) => {
  const {
    name,
    width = 250,
    height = 36,
    round = 0,
    mode = 'date',
    label = 'Date',
  } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [field, meta, helpers] = useField(name);

  const initialDate = field.value ? new Date(field.value) : new Date();

  const handleConfirm = (selectedDate: Date) => {
    setIsVisible(false);
    helpers.setValue(selectedDate.toISOString());
  };

  const handleCancel = () => {
    setIsVisible(false);
  };

  const handlePress = () => {
    setIsVisible(true);
  };

  return (
    <View style={{ gap: 5 }}>
      {label && field.value && <RenderLabel label={label} />}
      <Pressable
        onPress={handlePress}
        style={{
          height: verticalScale(height),
          borderWidth: 1,
          borderColor:
            meta.touched && meta.error
              ? Colors.textErrorColor
              : 'lightgrey',
          width: scale(width),
          paddingHorizontal: moderateScale(12),
          justifyContent: 'center',
          borderRadius: moderateScale(round),
          backgroundColor: 'white',
        }}
      >
        <CustomText
          color={
            field.value ? Colors.textBlackColor : Colors.secondaryButtonColor
          }
          size={13}
          text={
            field.value
              ? moment(field.value).format(
                  mode === 'date'
                    ? 'YYYY-MM-DD'
                    : mode === 'time'
                    ? 'hh:mm A'
                    : 'YYYY-MM-DD hh:mm A'
                )
              : `Select ${mode}`
          }
        />
      </Pressable>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={initialDate}
        maximumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        is24Hour={false}
        display="spinner"
      />
    </View>
  );
};

export default memo(FormikDateTimePicker);
