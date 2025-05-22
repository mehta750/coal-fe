import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Colors } from '../constant'

interface Props {
    size?: 'small' | 'large'
    color?: string
}
const Loader = (props: Props) => {
    const {size='large', color=Colors.primaryButtonColor} = props
  return <ActivityIndicator size={size} color={color} />
}

export default Loader