import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


type Data = {
  label?: string
  value?: string
}
interface Props {
  data: any
  setValue: (v: any) => void
  value: any
  w?: number
  h?: number
  placeholder?: string
  round?: boolean
  mode?: 'default' | 'modal'
  renderRightIcon?: boolean
}

const CustomDropdown = (props: Props) => {
  const { data, value, w = 200, h = 36, placeholder = "select", setValue, round = false, mode = 'default', renderRightIcon = true } = props
  return (
    <SafeAreaView style={{
      width: scale(w)
    }}>
      <Dropdown
        renderRightIcon={() => {
          if (!renderRightIcon) return null
          return <Ionicons name="chevron-down" size={scale(20)} color="gray" />
        }}
        mode={mode}
        style={[styles.dropdown, {
          height: verticalScale(h),
          borderRadius: round ? moderateScale(8) : 0,
        }]}
        containerStyle={{ minWidth: scale(80) }}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data || []}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: verticalScale(34),
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: moderateScale(12),
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: moderateScale(14),
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: moderateScale(14),
    color: '#333',
  },
});

export default memo(CustomDropdown)