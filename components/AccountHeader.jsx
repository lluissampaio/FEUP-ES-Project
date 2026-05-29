import { Colors } from "@/constants/colors";
import { auth } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AppIcon from "./AppIcon";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";

const AccountHeader = ({ name, email, avatarUrl, onEditPress }) => {
  const [uploading, setUploading] = useState(false);
  const [localPhoto, setLocalPhoto] = useState(null);
  const isAuthenticated = !!auth.currentUser;

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      AsyncStorage.getItem(`profilePhoto_${uid}`).then((photo) => {
        if (photo) setLocalPhoto(photo);
      });
    }
  }, []);

  const handlePhotoPress = async () => {
    if (!auth.currentUser) return;

    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (result.canceled || !result.assets?.[0]) return;

    setUploading(true);
    try {
      const uri = result.assets[0].uri;
      const uid = auth.currentUser.uid;
      await AsyncStorage.setItem(`profilePhoto_${uid}`, uri);
      await updateProfile(auth.currentUser, { photoURL: uri });
      setLocalPhoto(uri);
    } catch (err) {
      console.error("Erro ao guardar foto:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        onPress={handlePhotoPress}
        style={styles.avatarWrapper}
        activeOpacity={isAuthenticated ? 0.7 : 1}
        disabled={!isAuthenticated}
      >
        <Image
          source={{ uri: localPhoto || avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
        {isAuthenticated && (
          <View style={styles.editBadge}>
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <AppIcon name="edit" size={14} color="#fff" weight="bold" />
            )}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <TouchableOpacity onPress={onEditPress}>
            <AppIcon
              name="edit"
              size={18}
              color={Colors.primary}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.email}>{email}</ThemedText>
      </View>
    </ThemedView>
  );
};

export default AccountHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
  },
  avatarWrapper: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    backgroundColor: "#F2F3F2",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  email: {
    fontSize: 14,
    color: "#7C7C7C",
    marginTop: 2,
  },
});
