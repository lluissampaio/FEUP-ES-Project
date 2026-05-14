import ThemedText from '@/components/ThemedText';
import { StyleSheet, View } from 'react-native';

const GRADE_COLOURS = {
  A: { background: '#038141', text: '#fff' },
  B: { background: '#85BB2F', text: '#fff' },
  C: { background: '#FECB02', text: '#1a1a1a' },
  D: { background: '#EE8100', text: '#fff' },
  E: { background: '#E63E11', text: '#fff' },
};

const FALLBACK_COLOUR = { background: '#9E9E9E', text: '#fff' };

export default function ScoreBadge({ type, grade }) {
  if (!grade) return null;

  const normalised = String(grade).toUpperCase();
  const colours = GRADE_COLOURS[normalised] ?? FALLBACK_COLOUR;
  const label = type === 'eco' ? 'ECO' : 'NUTRI';

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[styles.pill, { backgroundColor: colours.background }]}>
        <ThemedText style={[styles.grade, { color: colours.text }]}>
          {normalised}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.5,
  },
  pill: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grade: {
    fontSize: 13,
    fontWeight: '800',
  },
});