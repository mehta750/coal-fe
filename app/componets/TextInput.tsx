import { Ionicons } from '@expo/vector-icons';
import React, { ReactElement, memo, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant';


interface Props {
  label: string
  type?: string | null
  required?: boolean
  value?: any
  error?: string | number | null | ReactElement
  keyboardType?: any
  width?: number | null
  round?: boolean
  enabled?: boolean
  multiline?: boolean
  setValue?: any
}

const FloatingLabelInput = (props: Props) => {
  const {
    label,
    setValue,
    value = null,
    type = null,
    error = null,
    keyboardType = "default",
    width = null,
    round = false,
    enabled = true,
    multiline = false
  } = props

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
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ position: 'relative' }}>
        <View style={[styles.inputContainer, {
          width: width ? scale(width) : '100%',
          borderRadius: round ? moderateScale(8) : 0,
          borderColor: error ? 'red' : '#ccc',
        }]}>
          {getIcon()?.left}
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            value={value}
            multiline={multiline}
            editable={enabled}
            keyboardType={type === 'email' ? "email-address" : keyboardType}
            style={styles.textInput}
            onChangeText={setValue}
            secureTextEntry={type === 'password' ? hidePassword : false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {getIcon()?.right}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </TouchableWithoutFeedback>
  )
}


export default memo(FloatingLabelInput)
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignContent: "center",
    alignItems: "center",
    borderWidth: 1,
    height: verticalScale(36),
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
    fontSize: moderateScale(12),
    top: verticalScale(38)
  },
})