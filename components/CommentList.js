//Used to display saved comments
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function CommentList({ comments, videoTime }) {

//console.log("videoTime",videoTime);

const formatTime = (seconds = 0) => {
  const totalMilliseconds = Math.floor(seconds * 100);
  const mins = Math.floor(totalMilliseconds / 6000).toString().padStart(2, "0");
  const secs = Math.floor((totalMilliseconds % 6000) / 100).toString().padStart(2, "0");
  const ms = (totalMilliseconds % 100).toString().padStart(2, "0");
  //console.log("min",mins,"sec",secs,"milisec",ms);

  return `${mins}:${secs}:${ms}`;
};
    
  return (
    <View style={styles.listBlock}>
      <Text style={styles.title}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => videoTime(item.time)}>
            <Text style={styles.time}>{formatTime(item.time)}</Text>
            <Text style={[styles.time, { marginLeft: 10 }]}>{item.text}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No comments</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listBlock: { 
    flex: 1, 
    padding: 8 
  },
  title: { 
    fontWeight: "700", 
    marginBottom: 6 
  },
  item: { 
    flexDirection: "row", 
    borderBottomWidth: 0.5, 
    borderColor: "#ccc", 
    paddingVertical: 6 
  },
  time: { 
    fontSize: 12, 
    fontWeight: "600" 
  },
});
