import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';

interface Props {
    data: any
    Content: any
}

const ReportCardList = (props: Props) => {
    const {data, Content} = props
    return (
       <View>
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
      padding: 16,
      gap: scale(8)
    },
    card: {
      backgroundColor: '#f8f9fa',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      elevation: 3, // for Android shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 }, // iOS shadow
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    quantity: {
      fontSize: 14,
      color: '#333',
    },
  });

export default ReportCardList