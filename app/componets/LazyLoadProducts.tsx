import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { moderateScale, verticalScale } from 'react-native-size-matters';
import API from '../common/api';
import { Colors, TEXT } from '../constant';
import showToast from '../helper/toast';
import Center from './Center';
import CustomText from './CustomText';
const screenWidth = Dimensions.get('window').width;

type ProductImages = {
  id: string, uri: string, productId: string
}

type ProductsType = {
  id: string
  name: string
  price: number
  specification: string
  productImages: ProductImages[] | []
}

const PAGE_SIZE = 10
export default function ProductsComponent() {

  const [data, setData] = useState<ProductsType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null)

  const fetchData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const url = `${API.products}?pageNumber=${page}&pageSize=${PAGE_SIZE}`
      const response = await axios.get(url);
      const newData = response.data || [];
      setData((prev: ProductsType[]) => [...prev, ...newData.products]);
      setHasMore(newData.products.length === PAGE_SIZE);
      setPage((prev: number) => prev + 1);
    } catch (error: any) {
      showToast("error", "Error", error?.message)
      setError(error?.message)
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error)
    return <Center>
      <CustomText text={error} />
      <CustomText text={"Please visit later"} />
    </Center>
  if (data.length === 0 && !loading)
    return <Center>
      <CustomText size={16} text={"No products available"} />
    </Center>

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => item.name + index}
      contentContainerStyle={styles.list}
      renderItem={({ item }: { item: ProductsType }) => <ProductCard item={item} />}
    />
  );
}

const ProductCard = ({ item }: { item: ProductsType }) => {
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const images = item.productImages || []
  const [error, setError] = useState(false)
  return (
    <View style={styles.card}>
      {
        images.length > 0 ?
          (<View
            id="carousel-component"
            dataSet={{ kind: "basic-layouts", name: "stack" }}
          >
            <Carousel
              autoPlayInterval={2000}
              ref={carouselRef}
              width={screenWidth * 0.85}
              height={verticalScale(180)}
              loop={true}
              data={images}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 50,
              }}
              snapEnabled={true}
              scrollAnimationDuration={400}
              renderItem={({ item: imageItem }) => {
                return <Image
                  source={
                    !error ? { uri: imageItem.uri }
                    : require('../assets/images/no-image.jpeg')
                  }
                  style={styles.image}
                  resizeMode="cover"
                  defaultSource={require('../assets/images/no-image.jpeg')}
                  onError={() => setError(true)}
                />
              }}
            />
          </View>) :
          (
            <View style={{
              width: screenWidth * 0.85,
              height: verticalScale(180),
              justifyContent:'center',
              alignItems: 'center'
            }}>
              <Image
                  source={require('../assets/images/no-image.jpeg')}
                  style={styles.image}
                  resizeMode="cover"
                  defaultSource={require('../assets/images/no-image.jpeg')}
                />
            </View>
          )
      }
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.spec}>{item.specification}</Text>
      <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: moderateScale(10),
    paddingBottom: moderateScale(80)
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: moderateScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  name: {
    fontSize: TEXT.fontSize16,
    fontWeight: 'bold',
    marginTop: moderateScale(6),
    textAlign: 'center',
  },
  spec: {
    fontSize: TEXT.fontSize13,
    color: '#666',
    textAlign: 'center',
    marginBottom: moderateScale(6),
  },
  price: {
    fontSize: TEXT.fontSize10,
    fontWeight: 600,
    color: Colors.primaryButtonColor
  },
});
