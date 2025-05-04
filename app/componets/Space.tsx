import { View } from 'react-native'
import React , {memo} from 'react'
import { scale, verticalScale } from 'react-native-size-matters';


interface Props {
    h?: number
    w?: number
}

const Space = (props: Props) => {
    const {h=10, w=10} = props
  return <View style={{
    height: verticalScale(h),
    width: scale(w)
  }}/>
}

export default memo(Space)