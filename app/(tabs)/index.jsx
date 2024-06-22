import {
  Image,
  Platform,
  Text,
  ScrollView,
  View,
  TextInput,
  Touchable,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Dimensions } from "react-native";
import weather_data from "@/app/(tabs)/weather_data";
import weather_icon from "@/app/(tabs)/weather_icon";
import { EvilIcons, FontAwesome6, Ionicons } from "@expo/vector-icons";
const [width, height] = [
  Dimensions.get("window").width,
  Dimensions.get("window").height,
];

export default function HomeScreen() {
  const iconKey = weather_data.weather[0].icon;
  const weather_description = weather_data.weather[0].description;
  const [temp_min, temp_max] = [
    weather_data.main.temp_min,
    weather_data.main.temp_max,
  ];
  return (
    <LinearGradient colors={["#06b6d4", "#60a5fa"]} className="h-full ">
      <SafeAreaView className="">
        <StatusBar style="dark" />

        {/* <View className="space-y-2">
          <View>
            <Text className="text-center text-3xl text-white">ClimeSky</Text>
          </View>
          <View className="w-[100vw] h-[1px] bg-white/30 my-4 m-auto"></View>
        </View> */}
        <View className="flex flex-row w-full justify-center items-center">
          <View className=" bg-white/70  h-12 flex flex-row justify-between items-center rounded-full m-4 ">
            <TextInput
              className="w-[70%] px-6 text-bold text-md"
              placeholder="Search City"
            ></TextInput>
            <TouchableOpacity>
              <Ionicons
                name="search-circle-sharp"
                size={48}
                color="white"
                className=""
              />
            </TouchableOpacity>
          </View>
          <Ionicons name="notifications" size={36} color="white" />
        </View>
        <ScrollView className="my-2 mx-4 p-4">
          <View className="flex flex-row justify-between items-center ">
            <View className="flex flex-row justify-start items-center  bg-white/30 p-2 px-4 rounded-full ">
              <Text className="text-lg font-bold text-white flex mr-2">
                {weather_data.name} , {weather_data.sys.country}
              </Text>
              <FontAwesome6 name="location-dot" size={24} color="white" />
            </View>
            <View className="flex flex-row justify-end items-center bg-white/30 p-2 px-4 rounded-full">
              <Text className="text-lg font-bold text-white">Celsius</Text>
            </View>
          </View>
          <View className="my-6 bg-white/30 p-4 rounded-3xl space-y-2">
            <Text className="text-center text-white text-6xl   h-20 pt-4 font-bold">
              {Math.round(weather_data.main.temp - 273.15)}°
            </Text>
            <Text className="text-center text-white text-md font-bold">
              Feels like {Math.round(weather_data.main.feels_like - 273.15)}°
            </Text>
            <View>
              <Image
                source={weather_icon[iconKey]}
                className="w-36 h-36 m-auto"
              />
            </View>
            <View>
              <Text className="text-center text-white text-md font-bold">
                {weather_description.charAt(0).toUpperCase() +
                  weather_description.slice(1) +
                  "  " +
                  Math.round(temp_min - 273.15) +
                  "°" +
                  "↓" +
                  "  " +
                  Math.round(temp_max - 273.15) +
                  "°" +
                  "↑"}
              </Text>
            </View>
          </View>
          <ScrollView horizontal={true} className="flex flex-row gap-2">
            <View className="w-32 bg-white/10 p-2 flex justify-center items-center space-y-2 rounded-xl">
              <Image
                source={require("@/assets/weather_icons/windspeed.png")}
                className="w-10 h-10 "
              />
              <View className="flex justify-center items-center">
                <Text className="text-white text-md font-bold">
                  {Math.floor(weather_data.wind.speed * 36) / 10} km/h
                </Text>
                <Text className="text-white text-sm font-thin">Wind speed</Text>
              </View>
            </View>
            <View className="w-32 bg-white/10 p-2 flex justify-center items-center space-y-2 rounded-xl">
              <Image
                source={require("@/assets/weather_icons/humidity.png")}
                className="w-10 h-10 "
              />
              <View className="flex justify-center items-center">
                <Text className="text-white text-md font-bold">
                  {Math.floor(weather_data.main.humidity)} %
                </Text>
                <Text className="text-white text-sm font-thin">Humidity</Text>
              </View>
            </View>
            <View className="w-32 bg-white/10 p-2 flex justify-center items-center space-y-2 rounded-xl">
              <Image
                source={require("@/assets/weather_icons/precepitation.png")}
                className="w-10 h-10 "
              />
              <View className="flex justify-center items-center">
                <Text className="text-white text-md font-bold">
                  {weather_data.rain["1h"]} mm
                </Text>
                <Text className="text-white text-sm font-thin">
                  Rain (1hour)
                </Text>
              </View>
            </View>
          </ScrollView>
          <View className="my-4 h-[40vh] bg-white/30"></View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
