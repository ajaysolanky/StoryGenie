import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { useFonts } from "@use-expo/font";
import AppLoading from "expo-app-loading";
import * as FacebookAds from "expo-ads-facebook";

import PromptScreen from "./app/screens/PromptScreen";
import StoryScreen from "./app/screens/StoryScreen";
import store from "./app/store/store";
import AppStackNavigator from "./app/navigation/AppStackNavigator";
import routes from "./app/navigation/routes";
// import fbAdsManager from "./app/config/fbAdsManager";
import { SESSION_ID } from "./app/utility/sessionId"; // don't remove this, it needs to be called
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";

LogBox.ignoreLogs([
  "Picker has been extracted from react-native core and will be removed in a future",
]);

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        console.log("Yay! I have user permission to track data");
      }
    })();
  }, []);

  const [isLoaded] = useFonts({
    Aladdin: require("./assets/aladdin_font.ttf"),
    AladdinTwo: require("./assets/aladdin_font_two.ttf"),
    EnchantedLand: require("./assets/EnchantedLand.otf"),
    HelveticaBold: require("./assets/Helvetica-Bold-Font.ttf"),
    TrebuchetMS: require("./assets/Trebuchet-MS.ttf"),
    TrebuchetMSItalic: require("./assets/Trebuchet-MS-Italic.ttf"),
  });

  if (!isLoaded) return <AppLoading />;

  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* <Stack.Navigator>
          <Stack.Screen name={routes.PROMPT_SCREEN} component={PromptScreen} />
          <Stack.Screen name={routes.STORY_SCREEN} component={StoryScreen} />
        </Stack.Navigator> */}
        <AppStackNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center',
    width: "100%",
  },
});
