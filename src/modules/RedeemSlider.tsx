////////////////////Nicole coded whole file////////////////////////////////
import React, { useState } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const RedeemSlider: React.FC<{ onComplete: () => void; isRedeemed: boolean }> = ({ onComplete, isRedeemed }) => {
  const [pan] = useState(new Animated.ValueXY());
  const [sliderWidth, setSliderWidth] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isRedeemed, // Disable sliding if already redeemed
    onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      useNativeDriver: false,
      listener: (_, gesture) => {
        // Constrain the movement within the slider width
        const maxOffset = sliderWidth - 50; // Adjust 50 to the width of the slider button
        if (gesture.dx < 0) {
          pan.setValue({ x: 0, y: 0 });
        } else if (gesture.dx > maxOffset) {
          pan.setValue({ x: maxOffset, y: 0 });
        }
      }
    }),
    onPanResponderRelease: (_, gesture) => {
      const maxOffset = sliderWidth - 50; // Adjust 50 to the width of the slider button
      if (gesture.dx > maxOffset * 0.8) { // Consider it redeemed if more than 80% swiped
        Animated.timing(pan, {
          toValue: { x: maxOffset, y: 0 },
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          onComplete();
          pan.setValue({ x: maxOffset, y: 0 }); // Keep it at the end position
        });
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isRedeemed ? 'Redeemed' : 'Slide to Redeem'}</Text>
      <View 
        style={[styles.sliderBackground, isRedeemed && styles.redeemedBackground]}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          {...(isRedeemed ? {} : panResponder.panHandlers)} // Disable pan handlers if redeemed
          style={[pan.getLayout(), styles.slider, isRedeemed && styles.redeemedSlider]}
        >
          <Text style={styles.arrow}>{isRedeemed ? '✓' : '→'}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sliderBackground: {
    width: '80%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 25,
    justifyContent: 'center',
  },
  slider: {
    width: 50,
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: 'white',
  },
  redeemedBackground: {
    backgroundColor: '#28a745',
  },
  redeemedSlider: {
    backgroundColor: '#28a745',
  },
});

export default RedeemSlider;
