import React, { memo, ReactElement } from 'react';
import { Platform, Pressable } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../constant';
import { useLocalisation } from '../locales/localisationContext';
import CustomText from './CustomText';
import Loader from './Loader';

interface Props {
    label?: string | ReactElement | any
    onPress?: () => void
    bg?: string
    color?: string
    w?: any
    p?: any
    round?: number
    size?: number
    h?: number | null
    disabled?: boolean
    isLoading?: boolean

}

const CustomButton = (props: Props) => {
    const {t} = useLocalisation()
    const {
        round = 0,
        onPress,
        label = t('submit'),
        bg = Colors.primaryButtonColor,
        color = Colors.textWhiteColor,
        w = 300,
        p = 6,
        size = 14,
        h = null,
        disabled = false,
        isLoading = false
    } = props
    return (
        <Pressable
            disabled={disabled || isLoading}
            onPress={onPress}
            style={{
                ...Platform.select({
                    android: {
                        elevation: 10,
                    },
                    ios: {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                    }
                }),
                width: scale(w),
                height: h ? verticalScale(h) : 'auto',
                backgroundColor: disabled ? Colors.disableColor : bg,
                padding: moderateScale(p),
                borderRadius: scale(round),
                justifyContent: "center",
                alignItems: "center",

            }}>
                <CustomText size={size} color={disabled ? Colors.secondaryButtonColor : color} text={isLoading ? <Loader size='small' color={Colors.textWhiteColor}/> : label}/>
        </Pressable>
    )
}

export default memo(CustomButton)
