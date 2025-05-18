import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from 'expo-router';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { moderateScale, verticalScale } from 'react-native-size-matters';
import * as yup from 'yup';
import API from '../common/api';
import { Colors, TEXT } from '../constant';
import { useAuth } from '../context/AuthContext';
import showToast from '../helper/toast';
import { useLocalisation } from '../locales/localisationContext';
import Button from './Button';
import Center from './Center';
import CustomText from './CustomText';
import FloatingButton from './FloatingButton';
import FormikTextInput from './FormikTextInput';
import AppModal from './Modal';
import ScrollViewComponent from './ScrollViewComponent';

const screenWidth = Dimensions.get('window').width;
const PAGE_SIZE = 10;

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

export default function ProductsComponent() {
  const [data, setData] = useState<ProductsType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [isVisibleModal, setVisibleModal] = useState(false);

  const { authState } = useAuth();
  const auth = authState?.authenticated;
  const role = authState?.role?.includes('admin');

  // Load more data
  const fetchNextPage = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const url = `${API.products}?pageNumber=${page}&pageSize=${PAGE_SIZE}`;
      const response = await axios.get(url);
      const newData = response.data || [];
      setData((prev) => [...prev, ...newData.products]);
      setHasMore(newData.products.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
    } catch (error: any) {
      showToast("error", "Error", error?.response.data.detail || "Error in fetch");
      setError(error?.message);
    }
    setLoading(false);
  };

  // Refresh the list (e.g. after adding a new product)
  const refreshData = async () => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    try {
      const url = `${API.products}?pageNumber=1&pageSize=${PAGE_SIZE}`;
      const response = await axios.get(url);
      const newData = response.data || [];
      setData(newData.products);
      setHasMore(newData.products.length === PAGE_SIZE);
      setPage(2); // Next page
    } catch (error: any) {
      showToast("error", "Error", error?.response.data.detail || "Error in fetch");
      setError(error?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading && data.length === 0) {
    return <Center><ActivityIndicator size={'large'} /></Center>
  }

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
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.name + index}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: ProductsType }) => <ProductCard item={item} />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
      />
      {(auth && role) && <FloatingButton onPress={() => setVisibleModal(true)} />}
      {(auth && role) &&
        <View>
          <AppModal isVisible={isVisibleModal} onClose={() => setVisibleModal(false)}>
          <RenderProductsAddForm
            onSuccess={() => {
              refreshData();
              setVisibleModal(false);
            }}
            setVisibleModal={setVisibleModal}
          />
        </AppModal>
          </View>
        }
    </View>
  );
}

const RenderProductsAddForm = ({ onSuccess, setVisibleModal }: { onSuccess: () => void, setVisibleModal: any }) => {
  const { t } = useLocalisation() as any;
  const schema = yup.object().shape({
    pName: yup.string().required('Product name required'),
    specification: yup.string().required('Specification required'),
    price: yup
      .number()
      .typeError('Price must be a number')
      .required('Price required')
      .positive('Price must be greater than 0')
  });

  const [imageError, setImageError] = useState<string | null>(null);
  const [imagess, setImages] = useState<any[]>([]);

  const pickMultipleImages = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });
    const image = result?.assets?.map((image: any) => image.uri);
    if (!result.canceled) {
      setImages(image);
      setImageError(null);
    }
  };

  return (
    <Formik
      initialValues={{ pName: "", specification: "", price: "" }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        if (imagess.length === 0) {
          setImageError("Please upload image");
          return;
        }

        const formData = new FormData();

        imagess.forEach((uri, index) => {
          formData.append('files', {
            uri,
            name: `image_${index}.jpg`,
            type: 'image/jpeg',
          } as any);
        });
        formData.append("name", values.pName);
        formData.append("specification", values.specification);
        formData.append("price", values.price);

        try {
          await axios.post(API.product, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          showToast("success", "Success", "Product uploaded successfully!");
          onSuccess();
        } catch (error: any) {
          showToast("error", 'Error', error?.response.data?.Errors?.[0] || error?.response.data?.detail || "Something went wrong...");
        } finally {
          setImages([]);
        }

        resetForm();
      }}
    >
      {({ handleSubmit, isSubmitting, resetForm }) => {
        useFocusEffect(useCallback(() => {
          resetForm();
          setImages([]);
        }, []));

        return (
          <ScrollViewComponent gap={30}>
            <FormikTextInput name="pName" label="Product name" width={210} />
            <FormikTextInput name="specification" label="Specification" width={210} />
            <FormikTextInput name="price" label="Price" width={210} keyboardType={"numeric"} />
            <Button
              label={"Choose images"}
              bg={'white'}
              color={Colors.textBlackColor}
              w={210}
              onPress={pickMultipleImages}
            />
            {imageError && <CustomText size={11} color={Colors.textErrorColor} text={imageError} />}
            {imagess.length !== 0 && <CustomText text={`No of images selected : ${imagess.length}`} />}
            <Button label={t('add')} onPress={handleSubmit as any} isLoading={isSubmitting} />
          </ScrollViewComponent>
        );
      }}
    </Formik>
  );
}

const ProductCard = ({ item }: { item: ProductsType }) => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const images = item.productImages || []
  const [error, setError] = useState(false)

  return (
    <View style={styles.card}>
      {
        images.length > 0 ?
          (
            <View>
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
                    onError={() => setError(true)}
                  />
                }}
              />
            </View>
          ) :
          (
            <View style={{
              width: screenWidth * 0.85,
              height: verticalScale(180),
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image
                source={require('../assets/images/no-image.jpeg')}
                style={styles.image}
                resizeMode="cover"
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
    fontWeight: '600',
    color: Colors.primaryButtonColor
  },
});
