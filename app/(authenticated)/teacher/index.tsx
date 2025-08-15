import { useAuth } from "@/components/AuthContext";
import * as ImagePicker from "expo-image-picker";
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
import BottomTabBar from "../../../components/BottomTabBar";
import ClassCard from "../../../components/ClassCard";
import CondicaoMedicaCard from "../../../components/CondicaoMedicaCard";
import StudentCard from "../../../components/StudentCard";
import apiService from "../../../services/api";
import { Aluno, AlunoCondicaoMedica, Remedio, Sala, Usuario } from "../../../types/api";

export default function TeacherIndex() {
  const [activeTab, setActiveTab] = useState<
    "classes" | "students" | "medical-conditions"
  >("classes");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<AlunoCondicaoMedica | null>(null);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [condicoesMedicas, setCondicoesMedicas] = useState<AlunoCondicaoMedica[]>([]);
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const { signOut, token } = useAuth();

  useEffect(() => {
    loadUserProfile();
    loadSalas();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiService.getUserProfile();
      let userData: Usuario;
      if (response.data && (response.data as any).data) {
        userData = (response.data as any).data;
      } else {
        userData = response.data;
      }
      console.log(userData)
      setUserProfile(userData);
    } catch (error) {
      console.error("Error loading user profile:", error);
      Alert.alert("Erro", "Erro ao carregar perfil do usuário");
    }
  };

  const loadSalas = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSalas();
      let salasData: Sala[];
      if (response.data && (response.data as any).data) {
        salasData = (response.data as any).data;
      } else {
        salasData = response.data;
      }
      setSalas(salasData);
    } catch (error) {
      console.error("Error loading salas:", error);
      Alert.alert("Erro", "Erro ao carregar salas");
      if ((error as any).response?.status === 401) {
        await signOut();
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAlunosBySala = async (sala: Sala) => {
    try {
      setLoading(true);
      const response = await apiService.getAlunosBySala(sala.id);
      let alunosData: Aluno[];
      if (response.data && (response.data as any).data) {
        alunosData = (response.data as any).data;
      } else {
        alunosData = response.data;
      }
      setAlunos(alunosData);
      setSelectedSala(sala);
    } catch (error) {
      console.error("Error loading alunos:", error);
      Alert.alert("Erro", "Erro ao carregar alunos");
      if ((error as any).response?.status === 401) {
        await signOut();
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadCondicoesMedicasByAluno = async (aluno: Aluno) => {
    try {
      setLoading(true);
      const response = await apiService.getCondicoesMedicasByAluno(aluno.id);
      let condicoesData: AlunoCondicaoMedica[];
      if (response.data && (response.data as any).data) {
        condicoesData = (response.data as any).data;
      } else {
        condicoesData = response.data;
      }
      setCondicoesMedicas(condicoesData);
      setSelectedAluno(aluno);
      
      // Carregar medicamentos do aluno
      await loadRemediosByAluno(aluno.id);
    } catch (error) {
      console.error("Error loading condições médicas:", error);
      Alert.alert("Erro", "Erro ao carregar condições médicas");
      if ((error as any).response?.status === 401) {
        await signOut();
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRemediosByAluno = async (alunoId: number) => {
    try {
      const response = await apiService.getRemediosByAluno(alunoId);
      let remediosData: Remedio[];
      if (response.data && (response.data as any).data) {
        remediosData = (response.data as any).data;
      } else {
        remediosData = response.data;
      }
      setRemedios(remediosData);
    } catch (error) {
      console.error("Error loading remedios:", error);
      // Não mostrar erro para medicamentos, pois é opcional
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: false,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setSelectedImage(result.assets[0].uri);
      }

      const response = await apiService.uploadProfilePicture(
        userProfile?.id || 0,
        result.assets?.[0]?.uri || '',
        'profile.jpg'
      );

      if (response) {
        Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
        await loadUserProfile();
      } else {
        Alert.alert('Erro', 'Falha ao atualizar foto de perfil');
      }

    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Erro", "Erro ao selecionar imagem");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfileModal(false);
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
      router.replace("/");
    }
  };

  const handleBackNavigation = () => {
    if (activeTab === "medical-conditions") {
      setActiveTab("students");
      setSelectedAluno(null);
      setCondicoesMedicas([]);
      setRemedios([]);
    } else if (activeTab === "students") {
      setActiveTab("classes");
      setSelectedSala(null);
      setAlunos([]);
    }
  };

  const handleConditionPress = (condicao: AlunoCondicaoMedica) => {
    setSelectedCondition(condicao);
    setShowConditionModal(true);
  };

  const handleEmergencia = async () => {
    if (!selectedCondition || !selectedAluno) {
      Alert.alert("Erro", "Dados não encontrados");
      return;
    }

    try {
      setLoading(true);
      
      const historicoData = {
        usuario_id: selectedAluno.id,
        descricao: `EMERGÊNCIA - ${selectedCondition.condicao_nome}\n` +
                  `Aluno: ${selectedAluno.nome_completo}\n` +
                  `Professor responsável: ${userProfile?.nome_completo || 'Professor'}\n` +
                  `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n` +
                  `Protocolo de emergência ativado conforme condição médica registrada.`,
        condicao_id: selectedCondition.condicao_id
      };

      await apiService.createHistorico(historicoData);
      
      Alert.alert(
        "Emergência Registrada", 
        "O protocolo de emergência foi ativado e registrado no histórico do aluno.",
        [
          {
            text: "OK",
            onPress: () => setShowConditionModal(false)
          }
        ]
      );
      
    } catch (error) {
      console.error("Error creating emergency record:", error);
      Alert.alert("Erro", "Falha ao registrar emergência. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            {salas.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma turma encontrada</Text>
            ) : (
              salas.map((sala) => (
                <ClassCard
                  key={sala.id}
                  className={sala.nome}
                  school="Escola Etec"
                  studentCount={0} // Fix: Considere passar o número real de alunos
                  onPress={() => {
                    loadAlunosBySala(sala);
                    setActiveTab("students");
                  }}
                />
              ))
            )}
          </>
        );
      case "students":
        return (
          <>
            <View style={styles.headerWithBack}>
              <TouchableOpacity onPress={handleBackNavigation} style={styles.backButton}>
                <Text style={styles.backText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.text}>
                Alunos {selectedSala ? `- ${selectedSala.nome}` : ""}
              </Text>
            </View>
            {alunos.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
            ) : (
              alunos.map((aluno) => (
                <StudentCard
                  key={aluno.id}
                  name={aluno.nome_completo}
                  hasAlert={false}
                  onPress={() => {
                    loadCondicoesMedicasByAluno(aluno);
                    setActiveTab("medical-conditions");
                  }}
                />
              ))
            )}
          </>
        );
      case "medical-conditions":
        return (
          <>
            <View style={styles.headerWithBack}>
              <TouchableOpacity onPress={handleBackNavigation} style={styles.backButton}>
                <Text style={styles.backText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.text}>
                Condições Médicas - {selectedAluno ? selectedAluno.nome_completo : ""}
              </Text>
            </View>
            
            {/* Seção de Condições Médicas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Condições Médicas</Text>
              {condicoesMedicas.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma condição médica encontrada</Text>
              ) : (
                condicoesMedicas.map((condicao) => (
                  <CondicaoMedicaCard
                    key={condicao.condicao_id}
                    nome={condicao.condicao_nome}
                    hasAlert={true}
                    onPress={() => handleConditionPress(condicao)}
                  />
                ))
              )}
            </View>

            {/* Seção de Medicamentos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medicamentos</Text>
              {remedios.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum medicamento registrado</Text>
              ) : (
                remedios.map((remedio) => (
                  <View key={remedio.id} style={styles.medicationCard}>
                    <Text style={styles.medicationName}>{remedio.nome}</Text>
                    <Text style={styles.medicationDosage}>Dosagem: {remedio.dosagem}</Text>
                    {remedio.horario && (
                      <Text style={styles.medicationTime}>Horário: {remedio.horario}</Text>
                    )}
                    {remedio.descricao && (
                      <Text style={styles.medicationDescription}>Obs: {remedio.descricao}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={require("../../../assets/images/qr-code.png")}
            style={styles.QRCODE}
          />
          <TouchableOpacity onPress={() => setShowProfileModal(true)}>
            <Image
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : require("../../../assets/images/prof.png")
              }
              style={styles.photo}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerBottom}>
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
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => { }}
          >
            <View style={styles.profileInfo}>
              <TouchableOpacity onPress={handleImagePick}>
                <Image
                  source={
                    selectedImage
                      ? { uri: selectedImage }
                      : require("../../../assets/images/prof.png")
                  }
                  style={styles.modalPhoto}
                />
              </TouchableOpacity>
              <Text style={styles.modalName}>
                {userProfile ? userProfile.nome_completo : "Professor"}
              </Text>
              {userProfile?.email && (
                <Text style={styles.modalEmail}>{userProfile.email}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showConditionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConditionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowConditionModal(false)}
        >
          <TouchableOpacity
            style={styles.conditionModalContent}
            activeOpacity={1}
            onPress={() => { }}
          >
            <View style={styles.conditionModalHeader}>
              <Text style={styles.conditionModalTitle}>
                {selectedCondition?.condicao_nome}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowConditionModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.conditionModalBody}>
              <Text style={styles.protocolLabel}>Protocolo de Emergência:</Text>
              <Text style={styles.protocolText}>
                {selectedCondition?.condicao_descricao || 'Nenhuma descrição disponível'}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={handleEmergencia}
                disabled={loading}
              >
                <Text style={styles.emergencyButtonText}>
                  {loading ? "Registrando..." : "🚨 EMERGÊNCIA"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.okButton}
                onPress={() => setShowConditionModal(false)}
              >
                <Text style={styles.okButtonText}>Entendi</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
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
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  headerBottom: {
    alignItems: "flex-start",
    width: "100%",
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
  // Fix: Novos estilos adicionados
  headerWithBack: {
    marginBottom: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: "#2684FE",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    fontStyle: "italic",
  },
  changePhotoText: {
    textAlign: "center",
    color: "#2684FE",
    fontSize: 12,
    marginTop: 5,
  },
  modalEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
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
  // Estilos do modal de condição médica
  conditionModalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    margin: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  conditionModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  conditionModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  conditionModalBody: {
    padding: 20,
  },
  protocolLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  protocolText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
  },
  modalButtons: {
    padding: 20,
    gap: 12,
  },
  emergencyButton: {
    backgroundColor: "#FF4444",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 8,
  },
  emergencyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  okButton: {
    backgroundColor: "#2684FE",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  okButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos para seções e medicamentos
  section: {
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    paddingLeft: 5,
  },
  medicationCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2684FE",
    marginBottom: 5,
  },
  medicationDosage: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  medicationTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  medicationDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});