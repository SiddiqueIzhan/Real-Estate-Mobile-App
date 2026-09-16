// import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

// export default function TabLayout() {
//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <Icon sf={{ default: "house", selected: "house.fill" }} />
//         <Label>Home</Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="search">
//         <Icon sf="magnifyingglass" />
//         <Label>Search</Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="saved">
//         <Icon sf="heart.fill" />
//         <Label>Saved</Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="profile">
//         <Icon sf="person.fill" />
//         <Label>Profile</Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
