import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

const Sunrise = () => {
  const [sunriseTime, setSunriseTime] = useState(new Date());
  const [sunsetTime, setSunsetTime] = useState(new Date());

  const [sunriseAnimation] = useState(new Animated.Value(0));
  const [sunsetAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fetch sunrise and sunset times from API or local data
    const fetchSunriseSunsetTimes = async () => {
      try {
        // Example of fetching sunrise and sunset times from an API
        const response = await fetch(
          "https://api.sunrise-sunset.org/json?lat=37.7749&lng=-122.4194"
        );
        const data = await response.json();
        const { sunrise, sunset } = data.results;
        setSunriseTime(new Date(sunrise));
        setSunsetTime(new Date(sunset));
      } catch (error) {
        console.error("Error fetching sunrise and sunset times:", error);
      }
    };

    fetchSunriseSunsetTimes();
  }, []);

  useEffect(() => {
    // Animate sunrise
    Animated.timing(sunriseAnimation, {
      toValue: 1,
      duration: 5000, // Adjust duration as needed
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Animate sunset
    Animated.timing(sunsetAnimation, {
      toValue: 1,
      duration: 5000, // Adjust duration as needed
      easing: Easing.linear,
      useNativeDriver: false,
      delay: 5000, // Start sunset animation after sunrise animation completes
    }).start();
  }, []);

  const sunriseBackgroundColor = sunriseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000080", "#FFA500"], // Adjust colors as needed
  });

  const sunsetBackgroundColor = sunsetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFA500", "#000080"], // Adjust colors as needed
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.sky, { backgroundColor: sunriseBackgroundColor }]}
      />
      <View style={styles.sunContainer}>
        <Animated.View
          style={[
            styles.sun,
            {
              left: sunriseAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sun,
            {
              left: sunsetAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
      <Animated.View
        style={[styles.sky, { backgroundColor: sunsetBackgroundColor }]}
      />
      <View style={styles.sunriseSunsetInfo}>
        <Text>Sunrise: {sunriseTime.toLocaleTimeString()}</Text>
        <Text>Sunset: {sunsetTime.toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sky: {
    position: "relative",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sunContainer: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  sun: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD700", // Adjust color as needed
    position: "absolute",
  },
  sunriseSunsetInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: "center",
  },
});

export default Sunrise;
