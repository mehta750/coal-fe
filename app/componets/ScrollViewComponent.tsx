import React from 'react'
import { ScrollView, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'

interface Props{
    children: any
    gap?: number
}

const ScrollViewComponent = (props: Props) => {
    const {children, gap=30} = props
  return (
    <ScrollView contentContainerStyle={{paddingBottom: moderateScale(60), paddingTop: moderateScale(20) }}>
      <View style={{flex: 1, gap: moderateScale(gap), justifyContent: "center", alignItems: 'center',padding: moderateScale(12)}}>
        {children}
      </View>
    </ScrollView>
  )
}

export default ScrollViewComponent