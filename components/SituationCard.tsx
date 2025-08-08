import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SituationCardProps {
  title: string;
  onPress?: () => void;
}

export default function SituationCard({ title, onPress }: SituationCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#4FA8FF', '#2684FE', '#1E6BDB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    borderRadius: 15,
    padding: 20,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
