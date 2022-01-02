import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { useFonts } from "@use-expo/font";
import AppLoading from "expo-app-loading";
import * as FacebookAds from "expo-ads-facebook";
import * as Analytics from "expo-firebase-analytics";

import PromptScreen from "./app/screens/PromptScreen";
import StoryScreen from "./app/screens/StoryScreen";
import store from "./app/store/store";
import AppStackNavigator from "./app/navigation/AppStackNavigator";
import routes from "./app/navigation/routes";
// import fbAdsManager from "./app/config/fbAdsManager";
import { SESSION_ID } from "./app/utility/sessionId"; // don't remove this, it needs to be called
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect, useRef } from "react";
import { logEventFirebase, SCREEN_VIEW } from "./app/utility/firebaseLogging";
import { navigationRef } from "./app/navigation/rootNavigation";

LogBox.ignoreLogs([
  "Picker has been extracted from react-native core and will be removed in a future",
]);

Analytics.setDebugModeEnabled(true);

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        // console.log("Yay! I have user permission to track data");
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

  const routeNameRef = useRef();

  if (!isLoaded) return <AppLoading />;

  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            // The line below uses the expo-firebase-analytics tracker
            // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
            // Change this line to use another Mobile analytics SDK
            // await analytics().logScreenView({
            //   screen_name: currentRouteName,
            //   screen_class: currentRouteName,
            // });
            await logEventFirebase(SCREEN_VIEW);
          }

          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName;
        }}
      >
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
