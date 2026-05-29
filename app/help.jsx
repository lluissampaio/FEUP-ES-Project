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
    question: "Como funciona a comparação de preços?",
    answer:
      "O motor de cálculo avalia a sua lista contra a base de dados para identificar a combinação de lojas mais económica. Nota técnica: nesta versão académica, o catálogo opera com dados simulados para demonstração isolada do algoritmo.",
  },
  {
    question: "Como posso criar a minha lista de compras?",
    answer:
      "Navegue pelas categorias ou utilize a pesquisa global na aba 'Explorar'. Selecione um produto, ajuste a quantidade desejada através do seletor e toque em 'Adicionar à Lista'.",
  },
  {
    question: "Como funciona a checklist durante as compras?",
    answer:
      "Na aba 'Lista', toque na caixa de verificação de um item para o marcar como recolhido. O sistema reordena a lista automaticamente, movendo os itens riscados para o fundo, mantendo o custo total estimado inalterado.",
  },
  {
    question: "Como altero a localização da pesquisa?",
    answer:
      "Aceda à aba 'Perfil' > 'Localização'. Insira uma morada manualmente ou reative a coordenada GPS. Os resultados da pesquisa de supermercados serão reajustados a este novo raio espacial.",
  },
  {
    question: "Como atualizo os meus dados de conta?",
    answer:
      "No 'Perfil', aceda ao ícone de edição. A mutação de credenciais sensíveis (e-mail/palavra-passe) requer a introdução da palavra-passe atual. A alteração de e-mail obriga à confirmação via link enviado para a nova caixa de correio.",
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
