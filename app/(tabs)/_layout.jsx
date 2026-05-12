import AppIcon from "@/components/AppIcon";
import { Colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.iconColor,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colorScheme === "dark" ? 0.3 : 0.05,
          shadowRadius: 10,

          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 12,

          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: "absolute",
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ínicio",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AppIcon name="shop" color={color} weight="regular" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AppIcon name="explore" color={color} weight="regular" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Lista",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AppIcon name="notepad" color={color} weight="regular" />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AppIcon name="account" color={color} weight="regular" />
          ),
        }}
      />
    </Tabs>
  );
}
