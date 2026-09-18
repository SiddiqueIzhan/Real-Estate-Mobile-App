import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types/properties";
import { useUser } from "@clerk/expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const { user } = useUser();

  const [featuredProperties, setFeaturedProperties] = useState<Property[] | []>(
    [],
  );
  const [recommendedProperties, setRecommendedProperties] = useState<
    Property[] | []
  >([]);
  const [loading, setIsLoading] = useState(false);

  const router = useRouter();

  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      const { data: featuredData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      setFeaturedProperties(featuredData ?? []);
      setRecommendedProperties(recommendedData ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        keyExtractor={(item) => item.id}
        data={recommendedProperties}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("../../../assets/images/kribb.png")}
                style={{ width: 90, height: 36 }}
                contentFit="contain"
              />
              <View className="items-end">
                <Text className="text-gray-500 text-xs">Good morning 👋</Text>
                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="mx-5 mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <FontAwesome name="search" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm flex-1">
                Search Properties, Cities, ...
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                className="w-8 h-8 rounded-xl items-center justify-center"
              >
                <Ionicons name="options" size={15} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
            <View className="mb-6">
              <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
                Featured
              </Text>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <FlatList
                    keyExtractor={(item) => item.id}
                    data={featuredProperties}
                    renderItem={({ item }) => <FeaturedCard property={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
                  />
                </View>
              )}
            </View>
            <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
              Recommended
            </Text>
          </View>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          <View>
            <Text>No Properties Found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomePage;
