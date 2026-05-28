import AppIcon from "@/components/AppIcon";
import Spacer from "@/components/Spacer";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View, useColorScheme } from "react-native";

const teamMembers = [
  {
    name: "Pedro Cunha Gonçalves de Melo",
    up: "up202406050",
    bio: "Focado na experiência do utilizador, garantiu que cada ecrã da app fosse intuitivo e agradável de usar.",
  },
  {
    name: "Daniel Filipe Cidade de Azeredo Lobo",
    up: "up202306056",
    bio: "Responsável pela pesquisa de produtos e integração com a base de dados, assegurou a consistência dos dados em toda a aplicação.",
  },
  {
    name: "Luís Miguel Branco Sampaio Costa",
    up: "up202404078",
    bio: "Desenvolveu o ecrã inicial e o carrinho de compras, trazendo as funcionalidades mais centrais da app à vida.",
  },
  {
    name: "José Dinis Rocha Melo Maçorano dos Santos",
    up: "up202405578",
    bio: "Dedicado à qualidade e organização do projeto, contribuiu para a robustez da autenticação e segurança da conta.",
  },
  {
    name: "Afonso Sofia de Moura",
    up: "up202403939",
    bio: "Implementou a infraestrutura de DevOps e funcionalidades como a localização, dark mode e a checklist interativa.",
  },
];

export default function AboutPage() {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          testID="about-back-button"
        >
          <AppIcon
            name="back"
            size={22}
            color={theme.iconColorFocused}
            weight="bold"
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Spacer height={10} />

        {/* Logo / Título */}
        <View style={styles.heroArea}>
          <View style={[styles.logoCircle, { backgroundColor: "#53B175" }]}>
            <AppIcon name="shop" size={40} color="#fff" weight="fill" />
          </View>
          <Spacer height={16} />
          <ThemedText style={styles.appName}>Cheapy</ThemedText>
          <ThemedText style={styles.appTagline}>
            Compra mais barato, sempre.
          </ThemedText>
        </View>

        <Spacer height={32} />

        {/* Sobre o projeto */}
        <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
          <ThemedText style={styles.sectionTitle}>O Projeto</ThemedText>
          <Spacer height={10} />
          <ThemedText style={styles.bodyText}>
            O Cheapy é uma aplicação mobile desenvolvida por estudantes da FEUP
            no âmbito de Engenharia de Software (2025/26). O seu objetivo é
            simplificar e otimizar as compras de supermercado — pesquisa
            produtos, compara preços entre lojas e encontra sempre a opção mais
            económica, seja num único supermercado ou em combinação de vários.
          </ThemedText>
        </View>

        <Spacer height={16} />

        {/* Equipa */}
        <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
          <ThemedText style={styles.sectionTitle}>A Equipa</ThemedText>
          <Spacer height={10} />
          {teamMembers.map((member, index) => (
            <View key={member.up}>
              <View style={styles.memberRow}>
                <View style={[styles.avatar, { backgroundColor: "#53B17520" }]}>
                  <ThemedText style={[styles.avatarText, { color: "#53B175" }]}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </ThemedText>
                </View>
                <View style={styles.memberInfo}>
                  <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                  <ThemedText style={styles.memberUp}>{member.up}</ThemedText>
                  <ThemedText style={styles.memberBio}>{member.bio}</ThemedText>
                </View>
              </View>
              {index < teamMembers.length - 1 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.searchBackground },
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        <Spacer height={40} />

        <ThemedText style={styles.footer}>
          FEUP · LEIC · 2025/26 · Turma 2LEIC14
        </ThemedText>
        <Spacer height={20} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroArea: {
    alignItems: "center",
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
  },
  appTagline: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.9,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "700",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
  },
  memberUp: {
    fontSize: 12,
    opacity: 0.4,
    marginTop: 2,
  },
  memberBio: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginHorizontal: 2,
  },
  footer: {
    fontSize: 12,
    opacity: 0.3,
    textAlign: "center",
  },
});
