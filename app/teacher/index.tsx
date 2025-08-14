import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import BottomTabBar from "../../components/BottomTabBar";
import ClassCard from "../../components/ClassCard";
import SituationCard from "../../components/SituationCard";
import StudentCard from "../../components/StudentCard";
import apiService from "../../services/api";
import { Aluno, Historico, Sala, Usuario } from "../../types/api";

export default function TeacherIndex() {
  const [activeTab, setActiveTab] = useState<
    "classes" | "students" | "situations"
  >("classes");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
    loadSalas();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      setUserProfile(response.data.data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadSalas = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSalas();
      setSalas(response.data.data);
    } catch (error) {
      console.error("Error loading salas:", error);
      Alert.alert("Erro", "Erro ao carregar salas");
    } finally {
      setLoading(false);
    }
  };

  const loadAlunosBySala = async (sala: Sala) => {
    try {
      setLoading(true);
      const response = await apiService.getAlunosBySala(sala.id);
      setAlunos(response.data.data);
      setSelectedSala(sala);
    } catch (error) {
      console.error("Error loading alunos:", error);
      Alert.alert("Erro", "Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  };

  const loadHistoricoByAluno = async (aluno: Aluno) => {
    try {
      setLoading(true);
      const response = await apiService.getHistoricoByUsuario(aluno.id);
      setHistorico(response.data.data);
      setSelectedAluno(aluno);
    } catch (error) {
      console.error("Error loading historico:", error);
      Alert.alert("Erro", "Erro ao carregar histórico");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
    });

    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    setShowProfileModal(false);
    router.replace("/");
  };

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Carregando...</Text>;
    }

    switch (activeTab) {
      case "classes":
        return (
          <>
            <Text style={styles.text}>Turmas</Text>
            {salas.map((sala) => (
              <ClassCard
                key={sala.id}
                className={sala.nome}
                school="Escola Etec"
                studentCount={0}
                onPress={() => {
                  loadAlunosBySala(sala);
                  setActiveTab("students");
                }}
              />
            ))}
          </>
        );
      case "students":
        return (
          <>
            <Text style={styles.text}>
              Alunos {selectedSala ? `- ${selectedSala.nome}` : ""}
            </Text>
            {alunos.map((aluno) => (
              <StudentCard
                key={aluno.id}
                name={aluno.nome_completo}
                hasAlert={false}
                onPress={() => {
                  loadHistoricoByAluno(aluno);
                  setActiveTab("situations");
                }}
              />
            ))}
          </>
        );
      case "situations":
        return (
          <>
            <Text style={styles.text}>
              {selectedAluno ? selectedAluno.nome_completo : "Histórico"}
            </Text>
            {historico.map((item) => (
              <SituationCard key={item.id} title={item.descricao} />
            ))}
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <Image
            source={require("../../assets/images/qr-code.png")}
            style={styles.QRCODE}
          />
          <TouchableOpacity onPress={() => setShowProfileModal(true)}>
            <Image
              source={require("../../assets/images/prof.png")}
              style={styles.photo}
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "flex-start", width: "100%" }}>
          <Text style={styles.headerText}>
            Olá {userProfile ? userProfile.nome_completo : "Professor"}!
          </Text>
        </View>
      </View>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{renderContent()}</View>
      </ScrollView>
      <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />

      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
          onResponderGrant={() => { }}
        >
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={handleImagePick}>
              <Image
                source={require("../../assets/images/prof.png")}
                style={styles.modalPhoto}
              />
            </TouchableOpacity>
            <Text style={styles.modalName}>
              {userProfile ? userProfile.nome_completo : "Professor"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: "auto",
    width: "100%",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    shadowColor: "rgba(38, 132, 254, 0.24)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(38, 132, 254, 0.25)",
  },
  headerText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  QRCODE: {
    width: 50,
    height: 50,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    shadowColor: "#000000ff",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 2,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#2684FE",
  },
  main: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    minWidth: 250,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#2684FE",
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
