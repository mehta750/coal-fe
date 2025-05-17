import React from 'react'
import { Image, Text } from 'react-native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { Colors } from '../constant'

interface Props {
    size?: number
    position?: 'absolute' | 'static'
}
const CompanyTitle = (props: Props) => {
    const { size = 10, position = 'absolute' } = props
    return (
        <Text style={{
            textShadowColor: 'lightgrey',
            textShadowOffset: { width: scale(2), height: scale(2) },
            textShadowRadius: moderateScale(1),
            position: position,
            fontSize: scale(size),
            top: verticalScale(42),
            color: Colors.primaryButtonColor,
            fontStyle: 'italic'

        }}>Clean Ozone</Text>
    )
}

interface CompanyLogoProps {
    w?:number
    h?:number
    borderRadius?: number
}
export const CompanyLogo = (props: CompanyLogoProps) => {
    const {w=60,h=60, borderRadius=50} = props
    return <Image
        source={require('../assets/images/logo.png')}
        style={{
            width: scale(w),
            height: scale(h),
            borderRadius: scale(borderRadius),
        }}
    />
}

export default CompanyTitle