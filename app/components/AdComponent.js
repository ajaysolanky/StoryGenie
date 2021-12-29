import React, { useRef, useEffect, useState } from "react";
import { Text, View } from "react-native";

import * as FacebookAds from "expo-ads-facebook";
const { AdIconView, AdMediaView, AdTriggerView } = FacebookAds;

class AdComponent extends React.Component {
  render() {
    console.log("help!!");
    console.log(this.props.nativeAd);
    return (
      //   <View>
      //     <AdMediaView />
      //     <AdTriggerView>
      //       <Text>{this.props.nativeAd.bodyText}</Text>
      //     </AdTriggerView>
      //   </View>
      <View>
        <AdMediaView />
        <AdIconView />
      </View>
      //   <View>
      //     <Text>{this.props.nativeAd.bodyText}</Text>
      //   </View>
    );
  }
}

export default FacebookAds.withNativeAd(AdComponent);
