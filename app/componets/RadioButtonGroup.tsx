import React, { useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../constant';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';


const SCREEN_WIDTH = Dimensions.get('window').width;

type Options = {
  label: string | number
  value: string | number
}
interface Props {
  options: Options[]
  selected: number
  onChange: (index: number) => void
}

export default function RadioButtonGroup(props: Props) {
  const {
    options = [],
    selected = 0,
    onChange,
  } = props
  const buttonWidth = SCREEN_WIDTH * 0.7 / options.length;
  const translateX = useSharedValue(selected * buttonWidth);

  useEffect(() => {
    translateX.value = withTiming(selected * buttonWidth, {
      duration: 250,
    });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
      <View style={[styles.buttonGroup, { width: buttonWidth * options.length }]}>
        <Animated.View
          style={[
            styles.animatedBackground,
            animatedStyle,
            { width: buttonWidth },
          ]}
        />
        {options.map((option, index) => {
          const isSelected = index === selected;
          return (
            <Pressable
              key={option.label}
              style={[styles.button, { width: buttonWidth }]}
              onPress={() => onChange(index)}
            >
              <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryButtonColor,
    borderRadius: moderateScale(30),
    overflow: 'hidden',
    position: 'relative',
  },
  animatedBackground: {
    position: 'absolute',
    height: '100%',
    backgroundColor: Colors.primaryButtonColor,
    borderRadius: moderateScale(30),
    zIndex: 0,
  },
  button: {
    paddingVertical: moderateScale(12),
    alignItems: 'center',
    zIndex: 1,
  },
  label: {
    color: Colors.primaryTextColor,
    fontWeight: '500',
  },
  selectedLabel: {
    color: Colors.textWhiteColor,
    fontWeight: 'bold',
  },
});
