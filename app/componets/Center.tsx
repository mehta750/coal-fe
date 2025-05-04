import { memo } from "react";
import { View } from "react-native";
import { scale } from "react-native-size-matters";

export enum DIRECTION {
    Row = 'row',
    Column = 'column',
   RowReverse = "row-reverse",
   ColumnReverse= "column-reverse"
}
  

interface Props {
    children: any
    gap?: number
    direction?: DIRECTION
    width?: number | null
}

const Center = (props: Props) => {
    const {gap=0, children, direction=DIRECTION.Column, width = null} = props
    return(
        <View style={{
            flex: 1,
            flexDirection: direction,
            justifyContent: 'center',
            alignItems: 'center',
            gap: scale(gap),
            width: width ? scale(width) : '100%'
        }}>
            {children}
        </View>
    )
}
export default memo(Center)