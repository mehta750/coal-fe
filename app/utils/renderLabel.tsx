import { View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../componets/CustomText";

const RenderLabel = ({label}: {label: string}) => <View style={{
    position: 'absolute',
    padding: moderateScale(1), 
    bottom: verticalScale(33),
    zIndex: 99,
    left: scale(9), 
    backgroundColor: 'white'}}>
        <CustomText size={12} text={label}/></View>
export default RenderLabel
