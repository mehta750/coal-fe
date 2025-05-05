import Toast from 'react-native-toast-message';

const showToast = (
    type: 'success' | 'error' | 'info'='success' ,
    text1='text1',
    text2='text2') => {
    Toast.show({
        position: 'bottom',
        type,
        text1,
        text2,
        visibilityTime: 3000
      });
}
export default showToast