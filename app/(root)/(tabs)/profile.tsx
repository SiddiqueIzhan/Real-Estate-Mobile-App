import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl"
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="flex-1 text-gray-700 font-medium text-base">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

const ProfileScreen = () => {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewProfilePic, setViewProfilePic] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();
  const ADMIN_EMAIL_ID = process.env.ADMIN_EMAIL_ID;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("error signing out");
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera is required!");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (result.canceled) {
        return;
      }

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDialogOptions = () => {
    Alert.alert("Select your choice", "Take Photo or Choose from gallery", [
      {
        text: "Camera",
        onPress: () => takePhoto(),
      },
      {
        text: "Gallery",
        onPress: () => handleUpdateProfileImage(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View className="items-center py-8">
        <View className="relative">
          <TouchableOpacity onPress={() => setViewProfilePic(true)}>
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full mb-4"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDialogOptions}
            disabled={isUpdating}
            className="absolute bottom-3 right-0 bg-blue-600 rounded-full p-2"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="camera" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-bold text-gray-800">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="text-gray-500 mt-1">
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
      </View>
      <View className="px-6 gap-2">
        <MenuItem
          icon="heart-outline"
          label="Saved Properties"
          onPress={() => router.push("/(root)/(tabs)/saved")}
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() =>
            Alert.alert("Coming Soon", "Notifications coming soon!")
          }
        />
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => Alert.alert("Coming Soon", "Settings coming soon!")}
        />
        {user.primaryEmailAddress?.emailAddress?.toLowerCase() !==
          ADMIN_EMAIL_ID && (
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() =>
              Linking.openURL(
                "mailto:izhanvk@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App",
              )
            }
          />
        )}
      </View>
      {/* Sign Out */}
      <View className="px-6 mt-5 mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>
      {viewProfilePic && (
        <ImageViewing
          images={[{ uri: user.imageUrl }]}
          imageIndex={0}
          visible={viewProfilePic}
          onRequestClose={() => setViewProfilePic(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
