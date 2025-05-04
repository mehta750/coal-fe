import { Text } from 'react-native'
import React, { ReactElement, memo } from 'react'
import { scale, moderateScale } from 'react-native-size-matters';


interface Props {
    text: string | ReactElement | number | null
    size?: number
    color?: string
    weight?: any
    spacing?: number,
    fontStyle?: any
}
const CustomText = (props: Props) => {
    const {text, size=12, color="#000", weight="normal", spacing = 0, fontStyle="normal"} = props
  return <Text style={{
    fontSize: scale(size),
    color,
    fontWeight: weight,
    letterSpacing: moderateScale(spacing),
    fontStyle: fontStyle
  }}>{text}</Text>
}

export default memo(CustomText)