import { View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../componets/CustomText";
import { Colors } from "../constant";
interface Props {
    label: string | number | null
    disabled?: boolean
}

const RenderLabel = (props: Props) => {
    const { label, disabled = false } = props
    return (
        <View style={{
            position: 'absolute',
            padding: moderateScale(1),
            paddingHorizontal: moderateScale(4),
            bottom: verticalScale(28),
            zIndex: 99,
            left: scale(9),
            backgroundColor: disabled ? Colors.disableColor : "white"
        }}>
            <CustomText size={14} text={label} /></View>
    )
}
export default RenderLabel
