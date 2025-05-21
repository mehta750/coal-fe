import React, { ReactElement, memo } from 'react';
import { Platform, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../constant';


interface Props {
  text: string | ReactElement | number | null
  size?: number
  color?: string
  weight?: any
  spacing?: number,
  fontStyle?: any
  center?: boolean
}
const CustomText = (props: Props) => {
  const { text, size = 12, color=Colors.textBlackColor, weight = "normal", spacing = 0, fontStyle = "normal", center = false } = props
  return <Text
    allowFontScaling
    style={{
      flexWrap: 'wrap',
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto' ,
      textAlign: center ? 'center' : 'left',
      fontSize: RFValue(size),
      color,
      fontWeight: weight,
      letterSpacing: moderateScale(spacing),
      fontStyle: fontStyle
    }}>{text}</Text>
}

export default memo(CustomText)