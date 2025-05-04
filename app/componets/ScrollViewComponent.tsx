import { View, ScrollView } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'

interface Props{
    children: any
    gap?: number
}

const ScrollViewComponent = (props: Props) => {
    const {children, gap=20} = props
  return (
    <ScrollView contentContainerStyle={{paddingBottom: moderateScale(60), paddingTop: moderateScale(20) }}>
      <View style={{flex: 1, gap: moderateScale(gap), justifyContent: "center", alignItems: 'center',padding: moderateScale(12)}}>
        {children}
      </View>
    </ScrollView>
  )
}

export default ScrollViewComponent