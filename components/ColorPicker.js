//Used as Color picker for drawing tool
import { View, TouchableOpacity, StyleSheet } from "react-native";

export default function ColorPicker({ colors, selectedColor, onSelectColor }) {
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorBox,
            { backgroundColor: color, 
              borderColor: color === selectedColor ? "#000" : "#ccc" },
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  colorBox: {
    width: 18,
    height: 18,
    marginHorizontal: 15,
    borderRadius: 4,
    borderWidth: 2,
  },
});
