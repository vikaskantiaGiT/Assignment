import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useVideoPlayer } from "expo-video";

import VideoPlayer from "./components/VideoPlayer";
import DrawingOverlay from "./components/DrawingOverlay";
import VideoSlider from "./components/VideoSlider";
import CommentInput from "./components/CommentInput";
import CommentList from "./components/CommentList";
import ColorPicker from "./components/ColorPicker"; 

const STORAGE_KEYS = {
  COMMENTS: "@comments",
  DRAWINGS: "@drawings",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16;

export default function App() {
  const VIDEO_SOURCE = require("./assets/sample.mp4");
  const player = useVideoPlayer(VIDEO_SOURCE);

  const overlayRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [paths, setPaths] = useState([]);
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [activeOverlayDrawing, setActiveOverlayDrawing] = useState(null);
  const [sliderWidth, setSliderWidth] = useState(SCREEN_WIDTH);

  const colors = ["yellow", "red", "blue"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    const checkDuration = setInterval(() => {
      if (player && player.duration && player.duration !== duration) {
        //console.log("Duration", player.duration);
        setDuration(player.duration);
      }
    }, 500);
    return () => clearInterval(checkDuration);
  }, [player, duration]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!player) return;

      const time = player.currentTime;
      //console.log("Current time:", time);
      setCurrentTime(time);

      if (duration > 0 && time >= duration) {
        //console.log("Ended");
        player.pause();
        setIsPlaying(false);

        try {
          player.currentTime = 0;
          setCurrentTime(0);
        } catch (e) {
          console.log(e);
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [player, duration]);



  useEffect(() => {
    (async () => {
      try {
        const cmts = await AsyncStorage.getItem(STORAGE_KEYS.COMMENTS);
        const drwgs = await AsyncStorage.getItem(STORAGE_KEYS.DRAWINGS);
        if (cmts) {
          //console.log("Comments loaded");
          setComments(JSON.parse(cmts));
        }
        if (drwgs) {
          //console.log("Drawings loaded");
          setSavedDrawings(JSON.parse(drwgs));
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    //console.log("Saving comments");
    AsyncStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    //console.log("Saving drawings");
    AsyncStorage.setItem(STORAGE_KEYS.DRAWINGS, JSON.stringify(savedDrawings));
  }, [savedDrawings]);

  useEffect(() => {
    const drawing = savedDrawings.find((d) => Math.abs(d.time - currentTime) <= 0.5);
    setActiveOverlayDrawing(drawing || null);
    Animated.timing(fadeAnim, {
      toValue: drawing ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentTime, savedDrawings]);

  const formatTime = (seconds = 0) => {
    const totalMilliseconds = Math.floor(seconds * 100);
    const mins = Math.floor(totalMilliseconds / 6000).toString().padStart(2, "0");
    const secs = Math.floor((totalMilliseconds % 6000) / 100).toString().padStart(2, "0");
    const ms = (totalMilliseconds % 100).toString().padStart(2, "0");
    //console.log("min",mins,"sec",secs,"milisec",ms);

    return `${mins}:${secs}:${ms}`;
  };

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        //console.log("Restarting");
        try {
          player.currentTime = 0;
          setCurrentTime(0);
        } catch (err) {
          console.log(err);
        }
      }

      player.play();
      setIsPlaying(true);
      setPaths([]);
    }
  };

  const setVideoTime = (time) => {
    if (!player) return;
    try {
      player.currentTime = time;
      setCurrentTime(time);
    } catch (e) {
      console.log(e);
    }
  };

  const addComment = async () => {
    const text = commentText.trim();
    if (!text) {
      Alert.alert("Nothing to save", "Please add a comment");
      return;
    }

    if (text) {
      const newComment = { id: `${Date.now()}`, text, time: currentTime };
      setComments((prev) => [...prev, newComment].sort((a, b) => a.time - b.time));
    }

    if (paths.length && overlayRef.current) {
      try {
        const uri = await overlayRef.current.capture();
        const newDrawing = { id: `${Date.now()}`, time: currentTime, uri };
        setSavedDrawings((prev) => [...prev, newDrawing].sort((a, b) => a.time - b.time));
      } catch (e) {
        console.log(e);
      }
    }

    setPaths([]);
    setCommentText("");
  };

  const handleTouchStart = (evt) => {
    if (isSliding || player.currentTime === 0 || isPlaying) return;
    const { locationX, locationY } = evt.nativeEvent.touches[0];
    const newPath = {
      id: `${Date.now()}`,
      points: [{ x: locationX, y: locationY }],
      strokeWidth: 3,
      color: selectedColor,
    };
    setPaths((prev) => [...prev, newPath]);
  };

  const handleTouchMove = (evt) => {
    if (isSliding || isPlaying) return;
    const { locationX, locationY } = evt.nativeEvent.touches[0];
    setPaths((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      last.points = [...last.points, { x: locationX, y: locationY }];
      return [...prev.slice(0, -1), last];
    });
  };

  const handleTouchEnd = () => {
    if (isSliding || isPlaying) return;
  };

  const handleInfo = () => {
    Alert.alert(
      "App Flow",
      "1. Play/Pause the video.\n2. Draw on frames when Video is paused.\n3. Add comments or draw on frames.\n4. Saved comments and drawings appear in the timeline.\n5. Tap comments to jump to that time.\n6. Use 'Clear All' to reset."
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to clear all comments and drawings?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEYS.COMMENTS);
              await AsyncStorage.removeItem(STORAGE_KEYS.DRAWINGS);
              setComments([]);
              setSavedDrawings([]);

              if (player) {
                player.pause();
                player.currentTime = 0; 
                setCurrentTime(0);
                setIsPlaying(false);
              }

            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
       
      <VideoPlayer 
        player={player} 
        videoHeight={VIDEO_HEIGHT} 
        screenWidth={'100%'}
      />

      <DrawingOverlay
        overlayRef={overlayRef}
        paths={paths}
        videoHeight={VIDEO_HEIGHT}
        screenWidth={SCREEN_WIDTH}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />

      {activeOverlayDrawing && (
        <Animated.Image
          source={{ uri: activeOverlayDrawing.uri }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SCREEN_WIDTH,
            height: VIDEO_HEIGHT,
            opacity: fadeAnim,
            resizeMode: "contain",
          }}
        />
      )}

      <ColorPicker colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />

      <View style={styles.controlsRow}>
        <Text>{formatTime(currentTime)}</Text>

        <TouchableOpacity style={styles.topBtn} onPress={handleInfo}>
          <Text style={styles.btnText}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} 
          onPress={togglePlay}>
          <Text style={styles.btnText}>{isPlaying ? "Pause" : "Play"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.topBtn, { backgroundColor: "red" }]} onPress={handleClearAll}>
          <Text style={styles.btnText}>Clear All</Text>
        </TouchableOpacity>

        <Text>{formatTime(duration)}</Text>
      </View>

      <VideoSlider
        duration={duration}
        currentTime={currentTime}
        comments={comments}
        savedDrawings={savedDrawings}
        sliderWidth={sliderWidth}
        setSliderWidth={setSliderWidth}
        videoTime={setVideoTime}
        onSlidingStart={() => {
          setIsSliding(true);
          setWasPlaying(isPlaying);
          if (isPlaying) {
            player.pause();
            setIsPlaying(false);
          }
        }}
        onValueChange={(val) => setCurrentTime(val)}
        onSlidingComplete={(val) => {
          setVideoTime(val);
          if (wasPlaying) {
            player.play();
            setIsPlaying(true);
          }
          setIsSliding(false);
        }}
      />


      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        addComment={addComment}
        placeholder={`Comment @ ${formatTime(currentTime)}`}
      />

      <View style={{ flex: 1 }}>
        <CommentList comments={comments} videoTime={setVideoTime} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginTop: 20,  
    backgroundColor: "#fff" 
  },
  topButtons: {        
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "space-between",
  paddingHorizontal: 10,
  zIndex: 9999,       
},
  topBtn: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 5,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 5,
  },
  controlBtn: { 
    padding: 6, 
    backgroundColor: "#333", 
    borderRadius: 4 
  },
  btnText: { 
    color: "#fff" 
  },
});
