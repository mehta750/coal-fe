import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useField } from 'formik';
import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors, TEXT } from '../constant';
import CustomText from './CustomText';

interface Option {
    label: string;
    value: string | number;
}

interface Props {
    name: string;
    items: Option[] | null;
    placeholder?: string;
    width?: number
    height?: number
    round?: number
    disabled?: boolean
    label?: string | null
}

const FormikDropdown: React.FC<Props> = ({
    name,
    placeholder,
    items,
    width = 250,
    height = 36,
    round = 0,
    disabled = false,
    label=null

}) => {
    const [field, meta, helpers] = useField(name);

    useFocusEffect(
        useCallback(() => {
            helpers.setValue('');
        }, [])
    );
    const placeholderText = 'Select an option'
    return (
        <View style={{ flex: 1, gap: 5 }}>
            {label && field.value && <CustomText size={12} text={label}/>}
            <Dropdown
                renderRightIcon={() => {
                    if (disabled) return null
                    return (
                        field.value ? (
                            <TouchableOpacity onPress={() => helpers.setValue(null)}>
                                <Ionicons name="close-circle" size={scale(20)} color="gray" />
                            </TouchableOpacity>
                        ) : (
                            <Ionicons name="chevron-down" size={scale(20)} color="gray" />
                        )
                    )
                }}
                dropdownPosition="auto"
                disable={disabled}
                style={[
                    {
                        width: scale(width),
                        height: verticalScale(height),
                        borderRadius: moderateScale(round),
                        backgroundColor: disabled ? Colors.disableColor : 'white',
                    },
                    styles.dropdown,
                    meta.touched && meta.error ? styles.errorBorder : {},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={items || []}
                maxHeight={verticalScale(300)}
                labelField="label"
                valueField="value"
                placeholder={placeholder || placeholderText}
                value={field.value}
                onChange={(item) => helpers.setValue(item.value)}
            />
            {meta.touched && meta.error && (
                <Text style={styles.errorText}>{meta.error}</Text>
            )}
        </View>
    );
};
export default memo(FormikDropdown)
const styles = StyleSheet.create({
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: moderateScale(12),
    },
    placeholderStyle: {
        fontSize: TEXT.fontSize13,
        color: Colors.secondaryButtonColor,
    },
    selectedTextStyle: {
        fontSize: TEXT.fontSize13,
        color: Colors.textBlackColor,
    },
    errorBorder: {
        borderColor: Colors.textErrorColor,
    },
    errorText: {
        position: 'absolute',
        color: Colors.textErrorColor,
        fontSize: TEXT.fontSize11,
        marginTop: verticalScale(4),
        top: verticalScale(32)
    },
});
