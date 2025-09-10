//Used as Video Player
import { View, StyleSheet } from "react-native";
import { VideoView } from "expo-video";

export default function VideoPlayer({ player, videoHeight, screenWidth }) {
  //console.log("Player instance:",player , "Height:", videoHeight, " Width:", screenWidth);
  return (
    <View style={[styles.videoContainer, { height: videoHeight }]}>
      <VideoView
        style={[styles.video, { width: screenWidth, height: videoHeight }]}
        player={player}
        contentFit="contain"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    //marginTop:20,
  },
  video: { 
    width: "100%", 
    height: "100%" 
  },
});
