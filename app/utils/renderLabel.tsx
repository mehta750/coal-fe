import { View } from "react-native";
import CustomText from "../componets/CustomText";

const RenderLabel = ({label}: {label: string}) => <View style={{position: 'absolute',padding: 1, bottom: 46,zIndex: 99,left: 12, backgroundColor: 'white'}}><CustomText size={12} text={label}/></View>
export default RenderLabel
