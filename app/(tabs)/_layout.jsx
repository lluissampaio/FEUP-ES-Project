import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Produtos' }} />
      <Tabs.Screen name="cart" options={{ title: 'Carrinho' }} />
    </Tabs>
  );
}