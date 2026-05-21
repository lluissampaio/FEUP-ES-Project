import { Stack } from "expo-router";

export default function ExploreSubLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="products" />
    </Stack>
  );
}
