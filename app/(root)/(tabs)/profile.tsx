import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("error signing out");
    }
  };
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        className="w-screen bg-blue-500 p-4"
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
