//Used for adding Comments
import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CommentInput({ commentText, setCommentText, addComment, placeholder }) {
  return (
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
});
