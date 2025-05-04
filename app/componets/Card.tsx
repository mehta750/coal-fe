import { Platform, Pressable } from 'react-native'
import React, { memo, ReactElement } from 'react'
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';

interface Props {
    bg?: string
    h?: number
    w?: number | null
    children?: ReactElement
    round?: number
    isTextCenter?: boolean
    onPress?: () => void
    maxH?: number
}

const Card = (props: Props) => {
    const {
        bg="white",
        h=50,
        w=null,
        children="This is card you can modify content",
        round=0,
        isTextCenter=false,
        onPress,
        maxH = null
    } = props
  return (

    <Pressable onPress={onPress} style={{
        ...Platform.select({
            ios:{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
            },
            android:{
                elevation: 8
            }
        }),
        position: 'relative',
        flex: 1,
        height: verticalScale(h),
        width: w ? scale(w): "100%",
        maxHeight: maxH ? scale(maxH) : "auto",
        backgroundColor: bg,
        padding: moderateScale(10),
        borderRadius: moderateScale(round),
        justifyContent: isTextCenter? 'center': 'flex-start',
        alignItems: isTextCenter? 'center': 'flex-start',

    }}>
      {children}
    </Pressable>
  )
}

export default memo(Card)