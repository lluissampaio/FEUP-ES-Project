import AppIcon from "@/components/AppIcon";
import Spacer from "@/components/Spacer";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";

const faqs = [
  {
    question: "Como funciona o algoritmo de comparação de preços?",
    answer:
      "O nosso algoritmo analisa os preços de cada produto em múltiplos supermercados e identifica as combinações que resultam no menor custo total para a sua lista de compras, tendo em conta os preços e as promoções em vigor de forma a garantir a opção mais económica.",
  },
  {
    question: "As promoções estão sempre atualizadas?",
    answer:
      "Sim, cruzamos dados constantemente para garantir que as promoções aplicadas refletem o valor real que irá pagar, ajudando-o a poupar de forma transparente.",
  },
  {
    question: "Posso confiar no preço final apresentado?",
    answer:
      "O valor apresentado reflete fielmente as promoções atuais e os preços recolhidos das superfícies comerciais. A nossa prioridade é oferecer-lhe resultados verídicos para que faça a melhor escolha.",
  },
  {
    question: "Como posso criar uma lista de compras?",
    answer:
      "Basta navegar pela app, procurar os seus produtos favoritos e adicioná-los à sua lista atual, tocando no ícone de adicionar. O algoritmo fará o resto do trabalho por si ao calcular o melhor carrinho.",
  },
];

export default function HelpPage() {
  const theme = Colors[useColorScheme()] ?? Colors.light;

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          testID="help-back-button"
        >
          <AppIcon
            name="back"
            size={22}
            color={theme.iconColorFocused}
            weight="bold"
          />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Ajuda</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Spacer height={10} />

        {/* Hero Area */}
        <View style={styles.heroArea}>
          <View style={[styles.logoCircle, { backgroundColor: "#53B175" }]}>
            <AppIcon name="help" size={40} color="#fff" weight="fill" />
          </View>
          <Spacer height={16} />
          <ThemedText style={styles.title}>Como podemos ajudar?</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tire o melhor partido das funcionalidades da app
          </ThemedText>
        </View>

        <Spacer height={32} />

        {/* FAQs */}
        <View style={[styles.card, { backgroundColor: theme.uiBackground }]}>
          <ThemedText style={styles.sectionTitle}>
            Perguntas Frequentes (FAQs)
          </ThemedText>
          <Spacer height={10} />
          {faqs.map((faq, index) => (
            <View key={index}>
              <View style={styles.faqRow}>
                <ThemedText style={styles.faqQuestion}>
                  {faq.question}
                </ThemedText>
                <ThemedText style={styles.faqAnswer}>{faq.answer}</ThemedText>
              </View>
              {index < faqs.length - 1 && (
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
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.1)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    opacity: 0.9,
    marginBottom: 8,
  },
  faqRow: {
    paddingVertical: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    marginHorizontal: 2,
  },
});
