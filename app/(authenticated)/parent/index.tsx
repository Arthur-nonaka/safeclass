import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../../components/AuthContext";
import BottomTabBar from "../../../components/BottomTabBar";
import ChildCard from "../../../components/ChildCard";
import apiService from "../../../services/api";
import {
    Aluno,
    AlunoCondicaoMedica,
    Remedio,
    Usuario,
} from "../../../types/api";

export default function ParentIndex() {
  const [activeTab, setActiveTab] = useState<"students" | "medical-conditions">(
    "students"
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Aluno | null>(null);
  const [childCondicoesMedicas, setChildCondicoesMedicas] = useState<
    AlunoCondicaoMedica[]
  >([]);
  const [userProfile, setUserProfile] = useState<Usuario | null>(null);
  const [filhos, setFilhos] = useState<Aluno[]>([]);
  const [remedios, setRemedios] = useState<Remedio[]>([]);
  const [loading, setLoading] = useState(false);

  // Campos para adicionar medicamento
  const [newMedication, setNewMedication] = useState({
    nome: "",
    dosagem: "",
    horario: "",
    descricao: "",
  });

  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    loadUserProfile();
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

      setUserProfile(userData);
      if (userData.id) {
        loadFilhos(userData.id);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      Alert.alert("Erro", "Erro ao carregar perfil do usuário");
    }
  };

  const loadFilhos = async (responsavelId: number) => {
    try {
      setLoading(true);
      const response = await apiService.getAlunosByResponsavel(responsavelId);
      let filhosData: Aluno[];
      if (response.data && (response.data as any).data) {
        filhosData = (response.data as any).data;
      } else {
        filhosData = response.data;
      }
      console.log(filhosData);

      setFilhos(filhosData);

      if (filhosData.length > 0) {
        loadAllRemedios(filhosData);
      }
    } catch (error) {
      console.error("Error loading filhos:", error);
      Alert.alert("Erro", "Erro ao carregar filhos");
    } finally {
      setLoading(false);
    }
  };

  const loadAllRemedios = async (children: Aluno[]) => {
    try {
      const allRemedios: Remedio[] = [];
      for (const child of children) {
        const response = await apiService.getRemediosByAluno(child.id);
        // Verificar estrutura da resposta baseada no backend
        let remediosData: Remedio[];
        if (response.data && (response.data as any).data) {
          remediosData = (response.data as any).data;
        } else {
          remediosData = response.data;
        }
        allRemedios.push(...remediosData);
      }
      setRemedios(allRemedios);
    } catch (error) {
      console.error("Error loading remedios:", error);
    }
  };

  const loadChildCondicoesMedicas = async (alunoId: number) => {
    try {
      const response = await apiService.getCondicoesMedicasByAluno(alunoId);
      let condicoesData: AlunoCondicaoMedica[];
      if (response.data && (response.data as any).data) {
        condicoesData = (response.data as any).data;
      } else {
        condicoesData = response.data;
      }
      setChildCondicoesMedicas(condicoesData);
    } catch (error) {
      console.error("Error loading condições médicas:", error);
      Alert.alert("Erro", "Erro ao carregar condições médicas");
    }
  };

  const handleChildPress = async (child: Aluno) => {
    setSelectedChild(child);
    await loadChildCondicoesMedicas(child.id);
    setShowChildModal(true);
  };

  const handleAddMedication = async () => {
    if (
      !selectedChild ||
      !newMedication.nome.trim() ||
      !newMedication.dosagem.trim()
    ) {
      Alert.alert(
        "Erro",
        "Preencha pelo menos o nome e a dosagem do medicamento"
      );
      return;
    }

    try {
      await apiService.createRemedio({
        aluno_id: selectedChild.id,
        nome: newMedication.nome.trim(),
        descricao: newMedication.descricao.trim() || undefined,
        dosagem: newMedication.dosagem.trim(),
        horario: newMedication.horario.trim() || undefined,
      });

      setNewMedication({ nome: "", dosagem: "", horario: "", descricao: "" });
      setShowMedicationModal(false);
      Alert.alert("Sucesso", "Medicamento adicionado com sucesso!");

      // Recarregar medicamentos
      if (filhos.length > 0) {
        loadAllRemedios(filhos);
      }
    } catch (error) {
      console.error("Error adding medication:", error);
      Alert.alert("Erro", "Erro ao adicionar medicamento");
    }
  };

  const handleRemoveMedication = async (
    medicamentoId: number,
    medicamentoNome: string
  ) => {
    console.log("handleRemoveMedication chamada com:", {
      medicamentoId,
      medicamentoNome,
    });

    Alert.alert(
      "Remover Medicamento",
      `Tem certeza que deseja remover o medicamento "${medicamentoNome}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => console.log("Cancelado"),
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            console.log("Iniciando remoção do medicamento:", medicamentoId);
            try {
              console.log("Chamando API deleteRemedio...");
              const result = await apiService.deleteRemedio(medicamentoId);
              console.log("Resultado da API:", result);

              Alert.alert("Sucesso", "Medicamento removido com sucesso!");

              // Recarregar medicamentos
              if (filhos.length > 0) {
                console.log("Recarregando medicamentos...");
                loadAllRemedios(filhos);
              }
            } catch (error) {
              console.error("Error removing medication:", error);
              console.error("Error details:", JSON.stringify(error, null, 2));
              Alert.alert(
                "Erro",
                "Erro ao remover medicamento: " + (error as any)?.message ||
                  "Erro desconhecido"
              );
            }
          },
        },
      ]
    );
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

  const getChildName = (alunoId: number): string => {
    const child = filhos.find((f) => f.id === alunoId);
    return child ? child.nome_completo : "Filho";
  };

  const handleTabPress = (
    tab: "students" | "medical-conditions" | "classes"
  ) => {
    if (tab === "students" || tab === "medical-conditions") {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>Carregando...</Text>;
    }

    switch (activeTab) {
      case "students":
        return (
          <>
            <Text style={styles.text}>Meus Filhos</Text>
            {filhos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum filho vinculado</Text>
                <Text style={styles.emptySubText}>
                  Entre em contato com a escola para vincular seus filhos
                </Text>
              </View>
            ) : (
              filhos.map((child) => (
                <ChildCard
                  key={child.id}
                  childName={`${child.nome_completo}`}
                  schoolInfo={
                    child.sala_nome
                      ? `Turma: ${child.sala_nome} `
                      : " Turma não definida"
                  }
                  details={
                    child.alergias
                      ? `Alergias: ${child.alergias}`
                      : "Sem alergias registradas"
                  }
                  onPress={() => handleChildPress(child)}
                />
              ))
            )}
          </>
        );
      case "medical-conditions":
        return (
          <>
            <Text style={styles.text}>Medicamentos dos Filhos</Text>
            {remedios.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Nenhum medicamento cadastrado
                </Text>
                <Text style={styles.emptySubText}>
                  Seus filhos não possuem medicamentos registrados
                </Text>
              </View>
            ) : (
              remedios.map((remedio) => (
                <View key={remedio.id} style={styles.medicationTabCard}>
                  <View style={styles.medicationTabContent}>
                    <View style={styles.medicationTabInfo}>
                      <Text style={styles.medicationTabChildName}>
                        {getChildName(remedio.aluno_id)}
                      </Text>
                      <Text style={styles.medicationTabName}>
                        {remedio.nome} - {remedio.dosagem}
                      </Text>
                      <Text style={styles.medicationTabDetails}>
                        Horário: {remedio.horario || "Não especificado"}
                      </Text>
                      {remedio.descricao && (
                        <Text style={styles.medicationTabNotes}>
                          Obs: {remedio.descricao}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.medicationTabDeleteButton}
                      onPress={() =>
                        handleRemoveMedication(remedio.id, remedio.nome)
                      }
                    >
                      <Text style={styles.medicationTabDeleteText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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
            justifyContent: "flex-end",
            width: "100%",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity onPress={() => setShowProfileModal(true)}>
            <Image
              source={require("../../../assets/images/prof.png")}
              style={styles.photo}
            />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "flex-start", width: "100%" }}>
          <Text style={styles.headerText}>
            Olá {userProfile ? userProfile.nome_completo : "Responsável"}!
          </Text>
        </View>
      </View>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{renderContent()}</View>
      </ScrollView>
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />

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
            onPress={() => {}}
          >
            <View style={styles.profileInfo}>
              <Image
                source={require("../../../assets/images/prof.png")}
                style={styles.modalPhoto}
              />
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
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showChildModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowChildModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.childModalContent}>
            <View style={styles.childModalHeader}>
              <Text style={styles.childModalTitle}>
                {selectedChild?.nome_completo}
              </Text>
              <TouchableOpacity onPress={() => setShowChildModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.childModalBody}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações Básicas</Text>
                <Text style={styles.infoText}>
                  Turma: {selectedChild?.sala_nome || "Não definida"}
                </Text>
                {selectedChild?.alergias && (
                  <Text style={styles.infoText}>
                    Alergias: {selectedChild.alergias}
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Condições Médicas</Text>
                </View>
                {childCondicoesMedicas.length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nenhuma condição médica registrada
                  </Text>
                ) : (
                  childCondicoesMedicas.map((relacao, index) => (
                    <View key={index} style={styles.conditionCard}>
                      <Text style={styles.conditionName}>
                        {relacao.condicao_nome}
                      </Text>
                      <Text style={styles.conditionProtocol}>
                        {relacao.condicao_descricao}
                      </Text>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Medicamentos</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowMedicationModal(true)}
                  >
                    <Text style={styles.addButtonText}>+ Adicionar</Text>
                  </TouchableOpacity>
                </View>
                {remedios.filter((r) => r.aluno_id === selectedChild?.id)
                  .length === 0 ? (
                  <Text style={styles.emptyText}>
                    Nenhum medicamento registrado
                  </Text>
                ) : (
                  remedios
                    .filter((r) => r.aluno_id === selectedChild?.id)
                    .map((remedio) => (
                      <View key={remedio.id} style={styles.medicationCard}>
                        <View style={styles.medicationHeader}>
                          <Text style={styles.medicationName}>
                            {remedio.nome}
                          </Text>
                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() =>
                              handleRemoveMedication(remedio.id, remedio.nome)
                            }
                          >
                            <Text style={styles.removeButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.medicationDosage}>
                          Dosagem: {remedio.dosagem}
                        </Text>
                        {remedio.horario && (
                          <Text style={styles.medicationTime}>
                            Horário: {remedio.horario}
                          </Text>
                        )}
                        {remedio.descricao && (
                          <Text style={styles.medicationNotes}>
                            Obs: {remedio.descricao}
                          </Text>
                        )}
                      </View>
                    ))
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Adicionar Medicamento */}
      <Modal
        visible={showMedicationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMedicationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.medicationModalContent}>
            <View style={styles.medicationModalHeader}>
              <Text style={styles.medicationModalTitle}>
                Adicionar Medicamento
              </Text>
              <TouchableOpacity onPress={() => setShowMedicationModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.medicationModalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome do Medicamento *</Text>
                <TextInput
                  style={styles.input}
                  value={newMedication.nome}
                  onChangeText={(text) =>
                    setNewMedication((prev) => ({ ...prev, nome: text }))
                  }
                  placeholder="Ex: Dipirona"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Dosagem *</Text>
                <TextInput
                  style={styles.input}
                  value={newMedication.dosagem}
                  onChangeText={(text) =>
                    setNewMedication((prev) => ({ ...prev, dosagem: text }))
                  }
                  placeholder="Ex: 500mg"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={newMedication.horario}
                  onChangeText={(text) =>
                    setNewMedication((prev) => ({ ...prev, horario: text }))
                  }
                  placeholder="Ex: 08:00, 14:00, 20:00"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newMedication.descricao}
                  onChangeText={(text) =>
                    setNewMedication((prev) => ({ ...prev, descricao: text }))
                  }
                  placeholder="Observações adicionais..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddMedication}
              >
                <Text style={styles.saveButtonText}>Salvar Medicamento</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
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
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2684FE",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  // Estilos dos modais
  childModalContent: {
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
  childModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  childModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  childModalBody: {
    maxHeight: "90%",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  conditionCard: {
    backgroundColor: "#fff5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#ff4444",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d63384",
    marginBottom: 5,
  },
  conditionProtocol: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#2684FE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  medicationCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  removeButton: {
    backgroundColor: "#ff4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  removeButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  medicationDosage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  medicationTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  medicationNotes: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  // Modal de medicamento
  medicationModalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    margin: 20,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  medicationModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  medicationModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  medicationModalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Estilos para aba de medicamentos
  medicationTabCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  medicationTabContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  medicationTabInfo: {
    flex: 1,
  },
  medicationTabChildName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2684FE",
    marginBottom: 4,
  },
  medicationTabName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 3,
  },
  medicationTabDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  medicationTabNotes: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },
  medicationTabDeleteButton: {
    backgroundColor: "#ff4444",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  medicationTabDeleteText: {
    fontSize: 18,
  },
});
