import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';

interface Props {
    data: any
    Content: any
}

const ReportCardList = (props: Props) => {
    const {data, Content} = props
    return (
      <View style={{flex: 1}}>
         <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={Content}
          contentContainerStyle={styles.listContainer}
        />
       </View>
      );
}
const styles = StyleSheet.create({
  listContainer: {
    padding: moderateScale(16),
    gap: scale(8)
  }
});
export default ReportCardList