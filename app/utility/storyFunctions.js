import fetchGPTResults from "../api/fetchGPTResults";
import {
  randomPromptsWithCharacters,
  randomPromptsWithoutCharacters,
} from "../config/randomPrompts";
import * as actionTypes from "../store/actions";

const defaultArgs = {
  min_length: 40,
  max_length: 50,
  temperature: 0.8,
  length_no_input: true,
  remove_input: true,
  repetition_penalty: 1.1,
  gpu: true,
  //   top_p: 0.95,
};

const addStoryHeader = (mood, name, storyText) => {
  // const moodLine = mood ? ` ${mood}` : "";
  // const nameLine = name ? ` about a person named ${name}` : "";
  // //   return `This is a${moodLine} story${nameLine}...\n\n${storyText}`;
  // return `Write a${moodLine} story${nameLine} based on this prompt:\nPrompt:\n${storyText}`;
  const moodLine = mood ? ` The genre of this story is ${mood}.` : "";
  const nameLine = name
    ? ` The main character of this story is named ${name}.`
    : "";
  return `Here's a story.${moodLine}${nameLine}\n${storyText}`;
};

export const generateInitStory = (mood, name, promptText) => {
  const promptTextPlus = addStoryHeader(mood, name, promptText);
  return (dispatch) => {
    dispatch({ type: actionTypes.SET_LOADING, isLoading: true });
    fetchGPTResults
      .fetchGPTResults({
        text: promptTextPlus,
        args: defaultArgs,
        num_retries: 2,
      })
      .then((results) => {
        if (results.ok) {
          dispatch({
            type: actionTypes.SET_INIT_STORY_TEXT,
            text: results.generated_text,
          });
        } else {
          // handle error
        }
        dispatch({ type: actionTypes.SET_LOADING, isLoading: false });
      });
  };
};

export const generateMoreStory = (mood, name, storySoFar) => {
  const storySoFarPlus = addStoryHeader(mood, name, storySoFar);
  return (dispatch) => {
    dispatch({ type: actionTypes.SET_LOADING, isLoading: true });
    fetchGPTResults
      .fetchGPTResults({
        text: storySoFarPlus,
        args: defaultArgs,
        num_retries: 2,
      })
      .then((results) => {
        if (results.ok) {
          dispatch({
            type: actionTypes.APPEND_STORY_TEXT,
            text: results.generated_text,
          });
        } else {
          // handle error
        }
        dispatch({ type: actionTypes.SET_LOADING, isLoading: false });
      });
  };
};

export const selectRandomPrompt = (characterName) => {
  let selectArr;
  if (characterName) {
    selectArr = randomPromptsWithCharacters;
  } else {
    selectArr = randomPromptsWithoutCharacters;
  }
  return selectArr[Math.floor(Math.random() * selectArr.length)];
};
