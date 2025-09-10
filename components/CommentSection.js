import React from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function CommentSection({
  commentText,
  setCommentText,
  addComment,
  placeholder,
  comments,
  videoTime,
}) {

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
    <View style={{ flex: 1 }}>
      {/* Input Row */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addComment}>
          <Text style={styles.btnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Comments List */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: "row", 
    padding: 8 
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 10,
  },
  btnText: { 
    color: "#fff" 
  },
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
