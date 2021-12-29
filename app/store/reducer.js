import { combineReducers } from "redux";
import * as actionTypes from "./actions";

/* Story Text */

const storyTextInitialState = {
  storyText: [],
};

const storyTextReducer = (state = storyTextInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INIT_STORY_TEXT:
      return {
        storyText: [action.text],
      };
    case actionTypes.APPEND_STORY_TEXT:
      return {
        storyText: [...state.storyText, action.text],
      };
    case actionTypes.REMOVE_STORY_TEXT:
      return {
        storyText: state.storyText.slice(0, state.storyText.length - 1),
      };
    case actionTypes.RESET_STORY_TEXT:
      return {
        storyText: [],
      };
    default:
      return state;
  }
};

/* Prompt */

const promptInitialState = {
  promptText: null,
  promptMood: null,
  promptName: null,
};

const promptReducer = (state = promptInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PROMPT:
      return {
        promptText: action.text,
        promptMood: action.mood,
        promptName: action.name,
      };
    default:
      return state;
  }
};

/* Loading */

const loadingState = {
  isLoading: false,
};

const isLoaadingReducer = (state = loadingState, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};

export default combineReducers({
  storyText: storyTextReducer,
  prompt: promptReducer,
  loading: isLoaadingReducer,
});
