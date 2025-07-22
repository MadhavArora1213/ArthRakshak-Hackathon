import React, { useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

// Pulse Animation Component
export const PulseAnimation = ({ children, duration = 2000, minScale = 0.95, maxScale = 1.05 }) => {
  const [pulseAnim] = useState(new Animated.Value(minScale));

  useEffect(() => {
    const createPulseAnimation = () => {
      return Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: maxScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: minScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    };

    const loopAnimation = () => {
      createPulseAnimation().start(() => {
        loopAnimation();
      });
    };

    loopAnimation();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
  );
};

// Fade In Animation Component
export const FadeInAnimation = ({ children, delay = 0, duration = 500 }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

// Slide In Animation Component
export const SlideInAnimation = ({ children, direction = 'left', delay = 0, duration = 600 }) => {
  const [slideAnim] = useState(new Animated.Value(direction === 'left' ? -100 : direction === 'right' ? 100 : direction === 'up' ? -100 : 100));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTransform = () => {
    if (direction === 'left' || direction === 'right') {
      return [{ translateX: slideAnim }];
    } else {
      return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View style={{ transform: getTransform() }}>
      {children}
    </Animated.View>
  );
};

// Bounce Animation Component
export const BounceAnimation = ({ children, delay = 0 }) => {
  const [bounceAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
      {children}
    </Animated.View>
  );
};

// Rotate Animation Component
export const RotateAnimation = ({ children, duration = 3000 }) => {
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const createRotateAnimation = () => {
      return Animated.timing(rotateAnim, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      });
    };

    const loopAnimation = () => {
      rotateAnim.setValue(0);
      createRotateAnimation().start(() => {
        loopAnimation();
      });
    };

    loopAnimation();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      {children}
    </Animated.View>
  );
};

// Progress Bar Animation Component
export const ProgressBarAnimation = ({ progress = 0.85, color = '#00C853', backgroundColor = '#E0E0E0', height = 8, duration = 1500 }) => {
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: duration,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <div style={{
      height: height,
      backgroundColor: backgroundColor,
      borderRadius: height / 2,
      overflow: 'hidden',
    }}>
      <Animated.View
        style={{
          height: '100%',
          width: width,
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </div>
  );
};

// Shake Animation Component (for alerts)
export const ShakeAnimation = ({ children, trigger = false }) => {
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      {children}
    </Animated.View>
  );
};

// Floating Animation Component
export const FloatingAnimation = ({ children, distance = 10, duration = 2000 }) => {
  const [floatAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const createFloatAnimation = () => {
      return Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]);
    };

    const loopAnimation = () => {
      createFloatAnimation().start(() => {
        loopAnimation();
      });
    };

    loopAnimation();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -distance],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};
