import React from "react";

export default ActivityIndicator = ({ visible = False }) => {
  if (!visible) return null;
  return (
    <LottieView
      autoplay
      loop
      source={require("../../assets/animations/loader.json")}
    />
  );
};
