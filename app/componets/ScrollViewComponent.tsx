import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface Props {
  children: React.ReactNode;
  gap?: number;
}

const ScrollViewComponent = ({ children, gap = 40 }: Props) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(10) : 0} // adjust if header present
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: moderateScale(60),
            paddingTop: moderateScale(20),
            paddingHorizontal: moderateScale(12),
            gap: moderateScale(gap),
          }}
        >
         <View style={{flex: 1, gap: moderateScale(gap), justifyContent: "center", alignItems: 'center',padding: moderateScale(12)}}>
          {children}
        </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ScrollViewComponent;
