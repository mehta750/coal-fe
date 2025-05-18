import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useField, useFormikContext } from 'formik';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors, TEXT } from '../constant';


interface Props {
  name: string
  label: any
  type?: string | null
  keyboardType?: any
  width?: number | null
  round?: boolean
  enabled?: boolean
  multiline?: boolean
  height?: number
}

const FormikTextInput = (props: Props) => {
  const {
    name,
    label,
    type = null,
    keyboardType = "default",
    width = null,
    round = false,
    enabled = true,
    multiline = false,
    height = 36,
  } = props

  const [field, meta, helpers] = useField(name);
  const { value } = field
  const { setValue } = helpers

  useFocusEffect(
    useCallback(() => {
      setValue('');
    }, [])
  );

  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle: any = {
    position: 'absolute',
    left: (type === 'email' || type === "password") ? moderateScale(36) : moderateScale(8),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [Platform.OS === 'ios'? verticalScale(11): verticalScale(8), verticalScale(-10)],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [scale(12), scale(12)],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#333'],
    }),
    backgroundColor: enabled === false ? Colors.disableColor : 'white',
    paddingHorizontal: moderateScale(4),
  };

  const getIcon = () => {
    if (type === 'email') {
      return {
        left: <Ionicons name={"mail-outline"} size={20} color="#666" style={{ marginRight: moderateScale(8) }} />,
        right: null
      }
    }
    if (type === "password") {
      return {
        left: <Ionicons name="lock-closed-outline" size={20} color="#666" style={{ marginRight: moderateScale(8) }} />,
        right: <Ionicons onPress={() => setHidePassword(!hidePassword)} name={hidePassword ? 'eye-off' : 'eye-outline'} size={20} color="#666" style={{ marginLeft: moderateScale(8) }} />
      }
    }
  }
  const { submitCount } = useFormikContext();
  return (
      <View style={{ position: 'relative' }}>
        <View style={[styles.inputContainer, {
          height: verticalScale(height),
          width: width ? scale(width) : '100%',
          borderRadius: round ? moderateScale(8) : 0,
          borderColor: (meta.error && (meta.touched && submitCount > 0) && enabled === true) ? 'red' : '#ccc',
          backgroundColor: enabled === false ? Colors.disableColor : 'white'
        }]}>
          {getIcon()?.left}
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            value={value}
            multiline={multiline}
            editable={enabled}
            keyboardType={type === 'email' ? "email-address" : keyboardType}
            style={[styles.textInput,{
              paddingVertical: Platform.OS === 'android' ? 0 : undefined,
            }]}
            onChangeText={setValue}
            secureTextEntry={type === 'password' ? hidePassword : false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              helpers.setTouched(true)
              setIsFocused(false)
            }}
          />
          {getIcon()?.right}
        </View>
        {meta.error && (meta.touched && submitCount > 0) && enabled === true && (
          <Text style={styles.errorText}>{meta.error}</Text>
        )}
      </View>
  )
}


export default memo(FormikTextInput)
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignContent: "center",
    alignItems: "center",
    borderWidth: 0.4,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    width: "100%",
  },
  errorText: {
    position: 'absolute',
    color: Colors.textErrorColor,
    fontSize: TEXT.fontSize11,
    top: verticalScale(38)
  },
})