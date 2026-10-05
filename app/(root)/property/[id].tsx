import { useSavedProperty } from "@/hooks/useSavedProperty";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types/properties";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="items-center gap-1">
      <Ionicons name={icon} size={20} color="#2563EB" />
      <Text className="text-gray-900 font-bold text-sm">{value}</Text>
      <Text className="text-gray-400 text-xs">{label}</Text>
    </View>
  );
}

const PropertyDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const authSupabase = useSupabase();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [imageViewing, setImageViewing] = useState<boolean>(false);
  const { isAdmin } = useUserStore();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(
    String(property?.id),
  );
  const router = useRouter();

  const { width } = Dimensions.get("screen");

  const ADMIN_PHONE = "7353790604";

  const mapUrl = property
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        property?.longitude - 0.003
      }%2C${property.latitude - 0.003}%2C${property?.longitude + 0.003}%2C${
        property?.latitude + 0.003
      }&layer=mapnik&marker=${property?.latitude}%2C${property?.longitude}`
    : "";

  const handleContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.title} ${property?.images[0]}`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(url);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.floor(e.nativeEvent.contentOffset.x / width);
    setActiveImage(index);
  };

  const fetchPropertyByID = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      setProperty(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkSold = async () => {
    try {
      Alert.alert("Mark as Sold", "Are You Sure?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Mark Sold",
          onPress: async () => {
            await authSupabase
              .from("properties")
              .update({ is_sold: true })
              .eq("id", id);

            setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      Alert.alert("Delete Property", "Are You Sure?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await authSupabase.from("properties").delete().eq("id", id);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPropertyByID();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View>
        <FlatList
          keyExtractor={(_, i) => i.toString()}
          data={property?.images}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-screen relative"
              onPress={() => setImageViewing(true)}
            >
              <Image
                source={{ uri: `${item}` }}
                style={{ width, height: 300 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          horizontal
          pagingEnabled
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
        <SafeAreaView className="absolute top-0 left-0 right-0">
          <View className="flex-row items-center justify-between px-4 pt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center"
              style={{ elevation: 3 }}
            >
              <Ionicons name="arrow-back" size={20} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleSave}
              disabled={saveLoading}
              className="w-10 h-10 bg-white rounded-full items-center justify-center"
              style={{ elevation: 3 }}
            >
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={20}
                color={isSaved ? "#EF4444" : "#111827"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View className="absolute bottom-4 right-4">
          <Text className="text-center text-white px-3 py-1.5 rounded-xl bg-slate-800">
            {activeImage + 1}/{property?.images.length}
          </Text>
        </View>
      </View>

      <View
        className="px-5 pt-5 pb-8"
        style={{ opacity: property?.is_sold ? 0.6 : 1 }}
      >
        <View className="flex-row gap-2 mb-3 flex-wrap">
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 text-xs font-semibold capitalize">
              {property?.type}
            </Text>
          </View>
          {property?.is_featured ? (
            <View className="bg-amber-50 px-3 py-1 rounded-full">
              <Text className="text-amber-600 text-xs font-semibold">
                {property?.is_featured}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {property?.is_sold && (
            <View className="bg-red-50 px-3 py-1 rounded-full">
              <Text className="text-red-500 text-xs font-semibold">Sold</Text>
            </View>
          )}
        </View>
        <View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {property?.title}
          </Text>
          <Text className="text-blue-600 text-xl font-bold mb-4">
            {formatPrice(property?.price ?? 0)}
          </Text>
        </View>
        <View className="flex-row justify-between bg-gray-50 rounded-2xl p-4 mb-5">
          <SpecItem
            icon="bed-outline"
            label="Beds"
            value={`${property?.bedrooms}`}
          />
          <SpecItem
            icon="water-outline"
            label="Baths"
            value={`${property?.bathrooms}`}
          />
          <SpecItem
            icon="expand-outline"
            label="Area"
            value={`${property?.area_sqft} ft²`}
          />
          <SpecItem
            icon="home-outline"
            label="Type"
            value={String(property?.type)}
          />
        </View>
        <Text className="text-base font-bold text-gray-900 mb-2">
          Description
        </Text>
        <Text className="text-gray-500 text-sm leading-6 mb-4">
          {property?.description}
        </Text>
        <Text className="text-base font-bold text-gray-900 mb-2">Location</Text>

        <View className="flex-row items-center gap-2 mb-4">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text className="text-gray-500 text-sm flex-1">
            {property?.address}, {property?.city}
          </Text>
        </View>
        <TouchableOpacity
          className="rounded-2xl overflow-hidden mb-6"
          style={{ height: 200 }}
          onPress={() =>
            router.push({
              pathname: "/(root)/property/map",
              params: {
                latitude: property?.latitude,
                longitude: property?.longitude,
                title: property?.title,
                address: property?.address,
              },
            })
          }
        >
          <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
          <View className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-full flex-row items-center gap-1">
            <Ionicons name="expand-outline" size={12} color="#374151" />
            <Text className="text-gray-600 text-xs font-medium">
              Tap to expand
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleContact}
          className="flex-row items-center justify-center gap-2 bg-green-600 py-4 rounded-2xl mb-4"
        >
          <Ionicons name="logo-whatsapp" size={20} color="white" />
          <Text className="text-white font-bold text-base">Contact Agent</Text>
        </TouchableOpacity>
        {isAdmin && (
          <View className="flex-row gap-3">
            {!property?.is_sold && (
              <TouchableOpacity
                onPress={handleMarkSold}
                className="flex-1 flex-row items-center justify-center gap-2 bg-amber-50 py-4 rounded-2xl border border-amber-200"
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#D97706"
                />
                <Text className="text-amber-600 font-semibold">Mark Sold</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text className="text-red-500 font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {property && (
        <ImageViewing
          images={property.images.map((uri) => ({ uri }))}
          imageIndex={activeImage}
          visible={imageViewing}
          onRequestClose={() => setImageViewing(false)}
        />
      )}
    </ScrollView>
  );
};

export default PropertyDetailsScreen;
