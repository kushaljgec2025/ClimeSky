import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ToastAndroid,
  Dimensions,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { EvilIcons, FontAwesome6, Ionicons } from "@expo/vector-icons";
import weather_icon from "@/app/(tabs)/weather_icon";
// import weather_data from "@/app/(tabs)/weather_data";
// import weather_forecast from "@/app/(tabs)/weather_forecast";
// import Sunrise from "@/app/(tabs)/Sunrise";
const [width, height] = [
  Dimensions.get("window").width,
  Dimensions.get("window").height,
];

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      setLoading(true);
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=7d553780d9dfe29244a8a05494ac793a`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === "404") {
            showToast("Location not found");
          } else {
            setTimeout(() => {
              setWeatherData(data);
              setLoading(false);
            }, 100);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=7d553780d9dfe29244a8a05494ac793a`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.cod === "404") {
            return;
          } else {
            setTimeout(() => {
              console.log(data);
              setWeatherForecast(data);
              setLoading(false);
            }, 100);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [location]);

  const showToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const searchCity = () => {
    if (city === "") return;

    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7d553780d9dfe29244a8a05494ac793a`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404") {
          showToast("Enter valid city name");
          setLoading(false);
        } else {
          setTimeout(() => {
            setWeatherData(data);
            setLoading(false);
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=7d553780d9dfe29244a8a05494ac793a`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404") {
          return;
        } else {
          setTimeout(() => {
            setWeatherForecast(data);
            setLoading(false);
          }, 100);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  console.log(weatherData);
  const todayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const iconKey = weatherData?.weather[0]?.icon;
  const weatherDescription = weatherData?.weather[0]?.description;
  const [tempMin, tempMax] = [
    weatherData?.main?.temp_min,
    weatherData?.main?.temp_max,
  ];

  return (
    <SafeAreaView
      className="h-full"
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <LinearGradient colors={["#06b6d4", "#60a5fb"]} className="h-full">
        <StatusBar style="light" />
        <View className="flex flex-row w-full justify-center items-center sticky py-2 space-x-2">
          <View className="bg-white/40 h-12 flex flex-row justify-between items-center rounded-full">
            <TextInput
              className="w-[70%] px-6 text-bold text-lg text-white font-semibold"
              placeholderTextColor={"white"}
              placeholder="Search City"
              value={city}
              onChangeText={(text) => setCity(text)}
              selectionColor={"white"}
            />
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                searchCity();
              }}
            >
              <Ionicons name="search-circle-sharp" size={48} color="white" />
            </TouchableOpacity>
          </View>
          <Ionicons name="notifications" size={36} color="white" />
        </View>
        {loading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-white mt-4">Loading...</Text>
          </View>
        )}
        {!loading && !weatherData && (
          <View className="flex-1 justify-center items-center">
            <Image
              source={require("@/assets/images/bg.jpeg")}
              className="w-full h-full"
            />
            <Text className="text-center text-3xl text-white absolute">
              Oops ! No weather data found for this location 🌧️.
            </Text>
          </View>
        )}
        {!loading && weatherData && (
          <ScrollView className="mb-2 mx-4 p-4">
            <View>
              <Text className="text-left text-white/60 font-bold m-2 ">
                {todayDate()}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center my-2">
              <View className="">
                <View className="flex flex-row justify-start items-center bg-white/30 p-2 px-4 rounded-full">
                  <Text className="text-sm font-bold text-white flex mr-2">
                    {weatherData?.name}, {weatherData?.sys?.country}
                  </Text>
                  <FontAwesome6 name="location-dot" size={24} color="white" />
                </View>
              </View>
              <View className="flex flex-row justify-end items-center bg-white/30 p-2 px-4 rounded-full">
                <Text className="text-xs font-bold text-yellow-300">
                  Celsius
                </Text>
              </View>
            </View>

            <View className="my-2 bg-white/30 p-4 rounded-3xl space-y-2">
              <Text className="text-center text-white text-6xl h-20 pt-4 font-bold">
                {Math.round(weatherData?.main?.temp - 273.15)}°
              </Text>
              <Text className="text-center text-white text-md font-bold">
                Feels like {Math.round(weatherData?.main?.feels_like - 273.15)}°
              </Text>
              <View>
                <Image
                  source={weather_icon[iconKey]}
                  className="w-36 h-36 m-auto"
                />
              </View>
              <View>
                <Text className="text-center text-white text-md font-bold">
                  {weatherDescription?.charAt(0)?.toUpperCase() +
                    weatherDescription?.slice(1) +
                    "  " +
                    Math.round(tempMin - 273.15) +
                    "°↓  " +
                    Math.round(tempMax - 273.15) +
                    "°↑"}
                </Text>
              </View>
            </View>

            <View className="flex flex-row my-2 m-auto w-full justify-between">
              <View className="w-[49%] bg-white/10 p-2 flex justify-center items-center space-y-2 rounded-xl">
                <Image
                  source={require("@/assets/weather_icons/windspeed.png")}
                  className="w-10 h-10"
                />
                <View className="flex justify-center items-center">
                  <Text className="text-white text-md font-bold">
                    {Math.floor(weatherData?.wind?.speed * 36) / 10} km/h
                  </Text>
                  <Text className="text-white text-sm font-thin">
                    Wind speed
                  </Text>
                </View>
              </View>
              <View className="w-[49%] bg-white/10 p-2 flex justify-center items-center space-y-2 rounded-xl">
                <Image
                  source={require("@/assets/weather_icons/humidity.png")}
                  className="w-10 h-10"
                />
                <View className="flex justify-center items-center">
                  <Text className="text-white text-md font-bold">
                    {Math.floor(weatherData?.main?.humidity)} %
                  </Text>
                  <Text className="text-white text-sm font-thin">Humidity</Text>
                </View>
              </View>
            </View>
            {weatherForecast && (
              <View>
                <View>
                  <Text className="text-white text-lg bg-white/20 px-6 rounded-full my-4">
                    Today's weather forecast
                  </Text>
                  <ScrollView
                    className="w-full  pr-4 rounded-xl bg-white/10 "
                    horizontal={true}
                  >
                    {weatherForecast.list
                      .filter(
                        (forecast, index) =>
                          forecast?.dt_txt?.slice(0, 10) === todayDate()
                      )
                      .map((forecast, index) => (
                        <View
                          key={index}
                          className="flex flex-col space-y-1 items-center  rounded-xl w-32 py-4  m-2"
                        >
                          <View className="flex flex-col justify-center items-center">
                            <Text className="text-white/50 text-xs my-1">
                              {forecast?.dt_txt?.slice(11, 16)}
                            </Text>
                            <Image
                              source={weather_icon[forecast?.weather[0]?.icon]}
                              className="w-10 h-10"
                            />
                          </View>

                          <View className="flex flex-col justify-center items-end">
                            <Text className="text-white text-md font-bold">
                              {Math.round(forecast?.main?.temp - 273.15)}°
                            </Text>
                            <Text className="text-white text-xs font-thin">
                              {forecast?.weather[0]?.main}
                            </Text>
                          </View>
                        </View>
                      ))}
                  </ScrollView>
                </View>
                <Text className="text-white text-lg bg-white/20 px-6 rounded-full my-4">
                  {Math.floor(weatherForecast?.list?.length / 4)} days weather
                  forecast
                </Text>
                <View className=" space-y-2 pb-4 rounded-xl">
                  {weatherForecast?.list
                    ?.filter(
                      (forecast, index) =>
                        forecast?.dt_txt?.slice(0, 10) != todayDate()
                    )
                    .map((forecast, index) => (
                      <View
                        key={index}
                        className="flex flex-row justify-between items-center bg-white/10 p-2 px-4 rounded-xl"
                      >
                        <View className="flex flex-col justify-center items-center">
                          <Text className="text-white text-md font-bold">
                            {forecast?.dt_txt?.slice(11, 16)}
                          </Text>
                          <Image
                            source={weather_icon[forecast?.weather[0]?.icon]}
                            className="w-10 h-10"
                          />
                        </View>
                        <Text className="text-white text-sm font-thin">
                          {forecast?.dt_txt.slice(0, 10)}
                        </Text>
                        <View className="flex flex-col justify-center items-end">
                          <Text className="text-white text-md font-bold">
                            {Math.round(forecast?.main?.temp - 273.15)}°
                          </Text>
                          <Text className="text-white text-xs font-thin">
                            {forecast?.weather[0]?.main}
                          </Text>
                        </View>
                      </View>
                    ))}
                </View>
              </View>
            )}
            <View>{/* <Sunrise /> */}</View>
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
