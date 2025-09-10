// Used as Slider in synch with Video
import { View, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";

export default function VideoSlider({
  duration,
  currentTime,
  comments,
  savedDrawings,
  sliderWidth,
  setSliderWidth,
  videoTime,
  onSlidingStart,
  onValueChange,
  onSlidingComplete,
}) {
  return (
    <View style={{ alignItems: "center", marginVertical: 5 }}>
      <View
        style={{ width: "100%" }}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          //console.log(" width:", width);
          setSliderWidth(width);
        }}
      >
        <Slider
          style={{ width: "100%", alignSelf: "center" }}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#007AFF"
          onSlidingStart={(val) => {
            //console.log("Started:", val);
            onSlidingStart(val);
          }}
          onValueChange={(val) => {
            //console.log("Value change:", val);
            onValueChange(val);
          }}
          onSlidingComplete={(val) => {
            //console.log("Completed:", val);
            onSlidingComplete(val);
          }}
        />

        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 30,
            top: 16,
          }}
          pointerEvents="box-none"
        >
          {comments.map((c) => {
            const leftPos = (c.time / duration) * sliderWidth;
            const hasDrawing = savedDrawings.some(
              (d) => Math.abs(d.time - c.time) <= 0.5
            );
            //console.log(`Comment at time:`, c.time);

            return (
              <TouchableOpacity
                key={c.id}
                style={{
                  position: "absolute",
                  left: leftPos - 5,                  
                  width: 15,
                  height: 15,
                  borderRadius: 5,
                  //marginTop:10,
                  backgroundColor: hasDrawing ? "cyan" : "orange",
                }}
                onPress={() => {
                  //console.log("Comment pressed, moving to:", c.time);
                  videoTime(c.time);
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
