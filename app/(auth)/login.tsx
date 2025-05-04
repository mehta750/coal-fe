import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Image, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import * as yup from 'yup';
import CustomButton from '../componets/Button';
import Center from '../componets/Center';
import CustomText from '../componets/CustomText';
import FormikTextInput from '../componets/FormikTextInput';
import { Colors } from '../constant';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Minimum 6 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain at least one special character'),
  });

  const { onLogin, authState } = useAuth()
  const router = useRouter()
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
      onSubmit={async (values) => {
        const { email, password } = values
        const result = await onLogin(email, password)
        if (result.accessToken)
          router.replace('/(main)')
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Center gap={28}>
          <View style={{gap: 8}}>
          <Image
            source={require('../assets/images/logo.png')}
            style={{
              width: scale(50),
              height: verticalScale(50),
              marginLeft: scale(10),
              borderRadius: scale(50)
            }}
          />
          <CustomText text={'Clean Ozone'} color={Colors.primaryButtonColor}/>
          </View>
          <FormikTextInput width={250} name='email' label='Email' type={'email'} />
          <FormikTextInput width={250} name='password' label='Password' type={'password'} />
          <CustomButton isLoading={authState?.isLoading || isSubmitting} h={32} onPress={handleSubmit} />
        </Center>
      )}

    </Formik>
  )
}

export default Login