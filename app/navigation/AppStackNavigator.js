import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { BlurView } from "expo-blur";
import { useSelector } from "react-redux";
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
  Entypo,
  FontAwesome,
  Octicons,
  AntDesign,
  Fontisto,
  EvilIcons,
} from "@expo/vector-icons";

import routes from "./routes";
import PromptScreen from "../screens/PromptScreen";
import StoryScreen from "../screens/StoryScreen";
import { STACK_HEADER_HEIGHT } from "../config/navigation";

const Stack = createStackNavigator();

const AppStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        // cardStyle: {
        //   alignItems: "center",
        //   flex: 1,
        // },
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            tint="dark"
            intensity={30}
            style={{
              width: "100%",
              height: STACK_HEADER_HEIGHT,
              borderRadius: 10,
              overflow: "hidden",
            }}
          />
        ),
        headerTitleStyle: {
          color: "white",
        },
        headerBackImage: () => (
          <MaterialCommunityIcons name="chevron-left" color="white" size={60} />
        ),
        // headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name={routes.PROMPT_SCREEN}
        component={PromptScreen}
      />
      <Stack.Screen
        name={routes.STORY_SCREEN}
        component={StoryScreen}
        options={{
          headerTitle: "",
          headerBackTitle: " ",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStackNavigator;
