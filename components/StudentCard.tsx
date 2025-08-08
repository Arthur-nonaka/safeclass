import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StudentCardProps {
  name: string;
  photo?: any;
  hasAlert?: boolean;
  onPress?: () => void;
}

export default function StudentCard({ name, photo, hasAlert = false, onPress }: StudentCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Image 
          source={photo || require('../assets/images/prof.png')} 
          style={styles.photo} 
        />
        <Text style={styles.name}>{name}</Text>
        {hasAlert && (
          <View style={styles.alertBadge}>
            <Text style={styles.alertText}>!</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  name: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  alertBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
