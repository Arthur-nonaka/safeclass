import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CondicaoMedicaCardProps {
  nome: string;
  hasAlert?: boolean;
  onPress: () => void;
}

const CondicaoMedicaCard: React.FC<CondicaoMedicaCardProps> = ({
  nome,
  hasAlert = false,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={styles.name}>{nome}</Text>
          <Text style={styles.subtitle}>Toque para ver protocolo</Text>
        </View>
        <View style={styles.rightContent}>
          {hasAlert && <View style={styles.alertDot} />}
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
    marginRight: 8,
  },
  arrow: {
    fontSize: 20,
    color: "#666",
    fontWeight: "300",
  },
});

export default CondicaoMedicaCard;
