import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0A0A0A",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: "tab-map",
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: "tab-saved",
        }}
      />
      <Tabs.Screen
        name="feasibility"
        options={{
          title: "Feasibility",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator-outline" size={size} color={color} />
          ),
          tabBarButtonTestID: "tab-feasibility",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
    height: Platform.OS === "ios" ? 88 : 64,
    paddingTop: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
