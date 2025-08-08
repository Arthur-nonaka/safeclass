import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ClassCardProps {
  className: string;
  school: string;
  studentCount: number;
  onPress?: () => void;
}

export default function ClassCard({ className, school, studentCount, onPress }: ClassCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#2785ff', '#0fc9f8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <Text style={styles.className}>{className}</Text>
          <Text style={styles.school}>{school}</Text>
          <Text style={styles.studentCount}>{studentCount} alunos</Text>
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
  className: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  school: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  studentCount: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
});
