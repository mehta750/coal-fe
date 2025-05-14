import React, { ReactElement, memo } from 'react';
import { Text } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';


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
    const {text, size=12, color="#000", weight="normal", spacing = 0, fontStyle="normal", center=false} = props
  return <Text style={{
    textAlign: center ? 'center': 'left',
    fontSize: scale(size),
    color,
    fontWeight: weight,
    letterSpacing: moderateScale(spacing),
    fontStyle: fontStyle
  }}>{text}</Text>
}

export default memo(CustomText)