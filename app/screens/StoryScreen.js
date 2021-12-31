import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { IconButton, Button } from "react-native-paper";
import * as FacebookAds from "expo-ads-facebook";

import { generateMoreStory } from "../utility/storyFunctions";
import { generateShareText } from "../utility/shareFunctions";
import colors from "../config/colors";
// import TypingText from "react-native-typical";
import TypingText from "../components/TypingText";
import * as actions from "../store/actions";
import { STACK_HEADER_HEIGHT } from "../config/navigation";
import { AD_LOAD, BANNER_ID } from "../config/ads";
import AdComponent from "../components/AdComponent";
import { intToBoolRand } from "../utility/crypto";
import { SESSION_ID } from "../utility/sessionId";

// Lottie genie: https://lottiefiles.com/58856-aladdin-genie

const StoryScreen = ({ nativeAd }) => {
  const dispatch = useDispatch();

  // const adsManager = new FacebookAds.NativeAdsManager(NATIVE_PLACEMENT_ID);

  const promptMood = useSelector((state) => state.prompt.promptMood);
  const promptName = useSelector((state) => state.prompt.promptName);
  const promptText = useSelector((state) => state.prompt.promptText);

  const storyChunks = useSelector((state) => state.storyText.storyText);
  const storyText = storyChunks.join("");

  const isLoading = useSelector((state) => state.loading.isLoading);

  const [allText, setAllText] = useState(false);
  const [justUndid, setJustUndid] = useState(false);

  const [dontShowAdIndeces, setDontShowAdIndices] = useState([]);

  const moodLine = promptMood ? ` ${promptMood}` : "";
  const nameLine = promptName ? ` about ${promptName}` : "";
  const introLine = `And so our${moodLine} tale${nameLine} begins...`;
  const storyData = [introLine, promptText, ...storyChunks, null].map(
    (e, i) => ({
      idx: i,
      item: e,
    })
  );

  const animationRef = useRef();
  const flRef = useRef();

  const clickGenMoreStory = () => {
    setAllText(true);
    dispatch(generateMoreStory(promptMood, promptName, promptText + storyText));
  };

  const undoLastStory = () => {
    setJustUndid(true);
    dispatch({ type: actions.REMOVE_STORY_TEXT });
  };

  const retryPrompt = () => {
    setJustUndid(true);
    dispatch({ type: actions.RESET_STORY_TEXT });
    dispatch(generateMoreStory(promptMood, promptName, promptText));
  };

  const shouldLoadAd = (idx) => {
    // return intToBoolRand(idx, AD_LOAD, SESSION_ID);
    return (
      idx % Math.floor(1.0 / AD_LOAD) === 0 && !dontShowAdIndeces.includes(idx)
    );
  };

  useEffect(() => {
    !justUndid && setAllText(false);
    setJustUndid(false);
  }, [storyChunks]);

  const cardColor = (index) => {
    const mod = index % 3;
    switch (mod) {
      case 0:
        return colors.pink;
      case 1:
        return colors.aqua;
      case 2:
        return colors.gold;
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: generateShareText(promptText + storyText),
      });
    } catch (error) {
      // idk
    }
  };

  const storyCard = (textEl, index) => (
    <View style={styles.storyPlusAdCard}>
      <TouchableOpacity onPress={setAllText}>
        <View
          key={Math.random()}
          onLayout={(e) => {
            flRef.current.scrollToEnd();
          }}
          style={[{ backgroundColor: cardColor(index) }, styles.storyCard]}
          marginVertical={3}
        >
          {textEl}
        </View>
      </TouchableOpacity>
      {shouldLoadAd(index) && (
        <View style={{ marginVertical: 10 }}>
          <FacebookAds.BannerAd
            placementId={BANNER_ID}
            type="standard"
            onPress={() => console.log("click")}
            onError={(error) => {
              console.log("error", error);
              setDontShowAdIndices([...dontShowAdIndeces, index]);
            }}
          />
        </View>
      )}
    </View>
  );

  const bottomButtonsDisabled = !allText || isLoading;

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* <View>
          <Text>{nativeAd.bodyText}</Text>
        </View> */}
        <View style={{ flex: 0.85 }}>
          <Text style={styles.headerText}>The Genie has a story for you!</Text>
        </View>
        <View style={{ flex: 0.15 }}>
          <IconButton
            icon={Platform.OS === "ios" ? "export-variant" : "share"}
            color={colors.offwhite}
            size={30}
            onPress={onShare}
          />
        </View>
      </View>
      {/* <View style={styles.topButtonsRow}>
        <IconButton
          icon={Platform.OS === "ios" ? "export-variant" : "share"}
          color={colors.offwhite}
          size={25}
          onPress={() => console.log("share")}
        />
        <IconButton
          icon={Platform.OS === "ios" ? "export-variant" : "share"}
          color={colors.offwhite}
          size={25}
          onPress={() => console.log("share")}
        />
      </View> */}
      <FlatList
        ref={flRef}
        data={storyData}
        keyExtractor={(item) => item.idx}
        style={styles.fl}
        // onScroll={(e) => {
        //   setScrollOffset(e.nativeEvent.contentOffset.y);
        // }}
        // onLayout={(e) => {
        //   setFlatListHeight(e.nativeEvent.layout.y);
        // }}
        renderItem={({ item, index, separators }) => {
          let textEl;
          if (index == storyData.length - 1) {
            if (isLoading)
              return storyCard(
                <ActivityIndicator size="large" color={colors.bloodRed} />,
                index
              );
            return <View style={{ height: 30 }}></View>;
          } else if (index == storyData.length - 2 && !allText) {
            textEl = (
              <TypingText
                textId={item.idx}
                doneTyping={setAllText}
                style={styles.storyText}
                loop={null}
                steps={[item.item]}
              />
            );
          } else {
            textEl = <Text style={styles.storyText}>{item.item}</Text>;
          }
          return storyCard(textEl, index);
        }}
      />
      {/* {isLoading && (
        <LottieView
          ref={animationRef}
          source={require("../../assets/aladdin_genie_loader.json")}
        />
      )} */}
      {/* Try this prompt again */}
      <View style={styles.bottomButtonsRow}>
        <Button
          disabled={bottomButtonsDisabled}
          onPress={clickGenMoreStory}
          mode="contained"
          icon="lead-pencil"
          compact={true}
          color={colors.purple}
        >
          Keep Writing!
        </Button>
        <Button
          disabled={bottomButtonsDisabled || storyChunks.length === 0}
          onPress={undoLastStory}
          mode="contained"
          icon="undo"
          color={colors.green}
        >
          Undo Last
        </Button>
      </View>
      <Button
        disabled={bottomButtonsDisabled || storyChunks.length === 0}
        onPress={retryPrompt}
        style={{ alignSelf: "center", marginBottom: 10 }}
        mode="contained"
        icon="cached"
        color={colors.bloodRed}
      >
        Retry Prompt
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingTop: STACK_HEADER_HEIGHT + 10,
    paddingBottom: 10,
  },
  topButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    paddingHorizontal: 20,
  },
  bottomButtonsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  fl: {
    // backgroundColor: "red",
    flexGrow: 0,
    width: "100%",
  },
  descRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Aladdin",
    color: colors.genieBlue,
    fontSize: 25,
    marginBottom: 10,
  },
  mediumText: {
    fontFamily: "Helvetica-Bold",
    color: colors.pink,
    fontSize: 25,
  },
  storyCard: {
    flexGrow: 0,
    // backgroundColor: colors.pink,
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
  },
  storyPlusAdCard: {
    marginBottom: 10,
  },
  storyText: {
    fontSize: 20,
    // color: "red",
    fontFamily: "TrebuchetMS",
    padding: 5,
  },
});

export default StoryScreen;
