import { Platform } from "react-native";

export const AD_LOAD = 0.25;

// export const MEDIUM_RECTANGLE_PLACEMENT_ID =
//   "1112497872824021_1113057069434768";

// export const NATIVE_PLACEMENT_ID =
//   "CAROUSEL_IMG_SQUARE_LINK#1112497872824021_1113057942768014";

// export const BANNER_ID = "IMG_16_9_LINK#1112497872824021_1113651456041996";
export const BANNER_ID =
  Platform.OS === "ios"
    ? "1112497872824021_1113651456041996"
    : "1112497872824021_1114843135922828";
