import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
  KeyboardAvoidingView,
  Share,
  Keyboard,
  Dimensions,
} from "react-native";

import SelectInput from "react-native-select-input-ios";
import { Picker } from "@react-native-picker/picker";
// import Picker from "react-native-universal-picker";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { useSelector, useDispatch } from "react-redux";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Button } from "react-native-paper";

import gptAPI from "../api/fetchGPTResults";
import * as actionTypes from "../store/actions";
import {
  generateInitStory,
  selectRandomPrompt,
} from "../utility/storyFunctions";
import colors from "../config/colors";
import routes from "../navigation/routes";
import { CHARACTER_SYMBOL } from "../config/randomPrompts";
import AdComponent from "../components/AdComponent";

const PromptScreen = ({ navigation }) => {
  const options = [
    { value: null, label: "any" },
    { value: "sad", label: "sad" },
    { value: "adventure", label: "adventure" },
    { value: "romantic", label: "romantic" },
    { value: "spooky", label: "spooky" },
  ];
  const [selectedMood, setSelectedMood] = useState(options[0].value);

  const [nameText, setNameText] = useState("");
  const [promptText, setPromptText] = useState("");
  const nameInputRef = useRef();
  const promptInputRef = useRef();
  const scrollRef = useRef();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [randString, setRandString] = useState(null);
  const finalPromptText = randString
    ? randString.split(CHARACTER_SYMBOL).join(nameText ? nameText : "our hero")
    : promptText;

  function onKeyboardDidShow(e) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    const showRef = Keyboard.addListener("keyboardDidShow", onKeyboardDidShow);
    const hideRef = Keyboard.addListener("keyboardDidHide", onKeyboardDidHide);
    return () => {
      showRef.remove();
      hideRef.remove();
    };
  }, []);

  const dispatch = useDispatch();

  navigation.addListener("focus", () =>
    dispatch({ type: actionTypes.RESET_STORY_TEXT })
  );

  const onPressRandom = () => {
    setRandString(selectRandomPrompt(nameText));
  };

  const onPromptChangeText = (newText) => {
    setRandString(null);
    setPromptText(newText);
  };

  const submitPrompt = () => {
    dispatch({
      type: actionTypes.SET_PROMPT,
      text: finalPromptText.trim(),
      mood: selectedMood,
      name: nameText.trim(),
    });
    dispatch({ type: actionTypes.RESET_STORY_TEXT });
    dispatch(generateInitStory(selectedMood, nameText, finalPromptText));
    navigation.navigate(routes.STORY_SCREEN);
  };

  const androidPicker = (
    <View
      style={[
        styles.selectInput,
        {
          justifyContent: "center",
          flexDirection: "column",
        },
      ]}
    >
      <Picker
        selectedValue={selectedMood}
        onValueChange={setSelectedMood}
        mode="dialog"
        backgroundColor="white"
      >
        {options.map((e, i) => (
          <Picker.Item label={e.label} value={e.value} key={i} />
        ))}
      </Picker>
    </View>
  );

  const iosPicker = (
    <SelectInput
      value={selectedMood}
      options={options}
      onCancelEditing={() => console.log("onCancel")}
      onSubmitEditing={setSelectedMood}
      style={styles.selectInput}
      labelStyle={styles.selectInputInner}
    />
  );

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[
        // { height: 1000 + keyboardHeight },
        styles.container,
      ]}
    >
      {/* <KeyboardAvoidingView
        behavior={"padding"}
        style={{
          flex: 1,
          width: "100%",
          position: "absolute",
          top: 100,
        }}
        enabled
      > */}
      <Image
        style={styles.headerLogo}
        resizeMode="contain"
        source={require("../../assets/story_genie.png")}
      />
      <Image
        style={styles.titleLogo}
        resizeMode="contain"
        source={require("../../assets/story_genie_text.png")}
      />
      <View style={styles.row}>
        <View style={styles.pickerRow}>
          <Text style={[styles.mediumText, { paddingRight: 18 }]}>Name:</Text>
          <TextInput
            ref={nameInputRef}
            style={styles.selectInput}
            onFocus={() => scrollRef.current.scrollToEnd()}
            onChangeText={setNameText}
            value={nameText}
            keyboardType="ascii-capable"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => nameInputRef.current.blur()}
            placeholder="Character Name"
            placeholderTextColor={colors.placeholderText}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.pickerRow}>
          <Text style={[styles.mediumText, { paddingRight: 14 }]}>Genre:</Text>
          {Platform.OS === "ios" ? iosPicker : androidPicker}
        </View>
      </View>
      {/* <KeyboardAccessoryView alwaysVisible={true} androidAdjustResize>
                    {({isKeyboardVisible}) => (
                        <View style={styles.textInputView}>
                            <TextInput
                                placeholder="Write your message"
                                underlineColorAndroid="transparent"
                                style={styles.textInput}
                                multiline={true}
                            />
                            {isKeyboardVisible && (
                                <Button
                                style={styles.textInputButton}
                                title="Send"
                                onPress={() => {}}
                                />
                            )}
                        </View>
                    )}
                </KeyboardAccessoryView> */}
      <Text
        style={[styles.mediumText, { alignSelf: "flex-start", margin: 10 }]}
      >
        Story Prompt:
      </Text>
      <Button
        onPress={onPressRandom}
        mode="contained"
        icon="dice-multiple"
        color={colors.purple}
        style={{ marginBottom: 10 }}
      >
        Random Prompt
      </Button>
      <TextInput
        ref={promptInputRef}
        style={styles.promptInput}
        onFocus={() => scrollRef.current.scrollToEnd()}
        onChangeText={onPromptChangeText}
        value={finalPromptText}
        multiline={true}
        keyboardType="ascii-capable"
        returnKeyType="done"
        blurOnSubmit={true}
        onSubmitEditing={() => promptInputRef.current.blur()}
        placeholder="Write the first couple lines of the story... or hit 'Random Prompt' for inspiration!"
        placeholderTextColor={colors.placeholderText}
        // onFocus={}
      />
      {/* <KeyboardSpacer /> */}
      <Button
        onPress={submitPrompt}
        mode="contained"
        icon="book-open-page-variant"
        color={colors.green}
      >
        Generate Story
      </Button>
      {/* </KeyboardAvoidingView> */}
      {/* {Platform.OS === "ios" ? iosPicker : androidPicker} */}
    </ScrollView>
  );
};

const MARGIN_SMALL = 8;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    height: Dimensions.get("window").height + (Platform.OS === "ios" ? 300 : 0),
  },
  textInputView: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#CCC",
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    textAlignVertical: "top",
  },
  textInputButton: {
    flexShrink: 1,
  },
  row: {
    flexDirection: "row",
    // justifyContent: "flex-end",
    alignItems: "center",
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    padding: MARGIN_SMALL,
    backgroundColor: colors.offwhite,
    width: "60%",
  },
  promptInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    width: "90%",
  },
  headerLogo: {
    width: 200 * 1.5,
    height: 150 * 1.5,
    marginTop: 10,
  },
  titleLogo: {
    width: 350,
    height: 100,
  },
  mediumText: {
    fontFamily: "HelveticaBold",
    color: colors.pink,
    fontSize: 25,
  },
  pickerRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10,
  },
  selectInputInner: {
    height: 36,
    borderRadius: 4,
  },
});

export default PromptScreen;
