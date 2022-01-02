import * as Analytics from "expo-firebase-analytics";

import getUserId, { setUserIdAsync } from "./idFunctions/userId";

export const logEventFirebase = async (eventName, extraParams = {}) => {
  await setUserIdAsync();
  //   getExperimentBuckets();
  const params = {
    // language: await getLanguageAsync(),
    // experimentBuckets: getExperimentBuckets(),
    guid: getUserId(),
    ...extraParams,
  };
  await Analytics.logEvent(eventName, params);
};

// const getExperimentBuckets = () => {
//   const buckets = [];
//   Object.entries(experiments).map(([_, details]) => {
//     const bucket = getExperimentBucket(getUserId(), details);
//     buckets.push(`${details.name}#${bucket}`);
//   });
//   return buckets.join("&");
// };

// events

// general
export const SCREEN_VIEW = "ScreenView";

// prompt page
export const CLICK_FOCUS_NAME_INPUT = "ClickFocusNameInput";
export const CLICK_FOCUS_GENRE_INPUT = "ClickFocusGenreInput";
export const CLICK_FOCUS_PROMPT_INPUT = "ClickFocusPromptInput";
export const CLICK_RANDOM_PROMPT = "ClickRandomPrompt";
export const CLICK_SUBMIT_PROMPT = "ClickSubmitPrompt";

// story page
export const CLICK_KEEP_WRITING = "ClickKeepWriting";
export const CLICK_UNDO_LAST = "ClickUndoLast";
export const CLICK_RETRY_PROMPT = "ClickRetryPrompt";
export const CLICK_SHARE_TOP_RIGHT = "ClickShareTopRight";
export const SHARE_SUCCESS = "ShareSuccess";
export const SHARE_DISMISS = "ShareDismiss";
export const CLICK_STORY_CARD = "ClickStoryCard";
