import React from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { moderateScale, verticalScale } from 'react-native-size-matters'

interface Props{
    children: any
    gap?: number
}

const ScrollViewComponent = (props: Props) => {
    const {children, gap=30} = props
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(10) : 0} // Adjust if header is present
      >
    <ScrollView
    keyboardShouldPersistTaps="handled"
     contentContainerStyle={{paddingBottom: moderateScale(60), paddingTop: moderateScale(20) }}>
      <View style={{flex: 1, gap: moderateScale(gap), justifyContent: "center", alignItems: 'center',padding: moderateScale(12)}}>
        {children}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default ScrollViewComponent