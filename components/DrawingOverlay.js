//Used as Freehand Drawing on Video Frame
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import ViewShot from "react-native-view-shot";

export default function DrawingOverlay({
  overlayRef,
  paths,
  videoHeight,
  screenWidth,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) {

  //console.log("height:",videoHeight,"width:", screenWidth,"paths:", paths.length);

  const pointsToSvgPath = (points = []) => {
    if (!points.length) return "";
    const pathString = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    //console.log("Path:", pathString);
    return pathString;
  };

  return (
    <View
      style={[styles.overlay, { width: screenWidth, height: videoHeight }]}
      pointerEvents="auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ViewShot
        style={[styles.overlay, { width: screenWidth, height: videoHeight }]}
        ref={overlayRef}
        options={{ format: "png", quality: 1 }}
      >
        <Svg style={styles.svg}>
          {paths.map((p) => {
            //console.log(`Path ${p.id}, points:`, p.points.length);
            return (
              <Path
                key={p.id}
                d={pointsToSvgPath(p.points)}
                stroke={p.color}
                strokeWidth={p.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}
        </Svg>
      </ViewShot>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: 
  {
    position: "absolute",
    top: 0,
    left: 0,
  },
  svg: 
  { 
    width: "100%", 
    height: "100%" 
  },
});
