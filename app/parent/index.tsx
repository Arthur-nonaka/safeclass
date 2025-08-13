import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomTabBar from "../../components/BottomTabBar";
import ChildCard from "../../components/ChildCard";
import apiService from "../../services/api";
import { Aluno, Historico, Remedio, Usuario } from "../../types/api";

export default function ParentIndex() {
    const [activeTab, setActiveTab] = useState<'classes' | 'students' | 'situations'>('students');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userProfile, setUserProfile] = useState<Usuario | null>(null);
    const [filhos, setFilhos] = useState<Aluno[]>([]);
    const [remedios, setRemedios] = useState<Remedio[]>([]);
    const [historico, setHistorico] = useState<Historico[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const response = await apiService.getUserProfile();
            setUserProfile(response.data);
            if (response.data.id) {
                loadFilhos(response.data.id);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    const loadFilhos = async (responsavelId: number) => {
        try {
            setLoading(true);
            const response = await apiService.getFilhos(responsavelId);
            setFilhos(response.data);
            
            // Load all remedios and historico for all children
            if (response.data.length > 0) {
                loadAllRemedios(response.data);
                loadAllHistorico(response.data);
            }
        } catch (error) {
            console.error('Error loading filhos:', error);
            Alert.alert('Erro', 'Erro ao carregar filhos');
        } finally {
            setLoading(false);
        }
    };

    const loadAllRemedios = async (children: Aluno[]) => {
        try {
            const allRemedios: Remedio[] = [];
            for (const child of children) {
                const response = await apiService.getRemediosByAluno(child.id);
                allRemedios.push(...response.data);
            }
            setRemedios(allRemedios);
        } catch (error) {
            console.error('Error loading remedios:', error);
        }
    };

    const loadAllHistorico = async (children: Aluno[]) => {
        try {
            const allHistorico: Historico[] = [];
            for (const child of children) {
                const response = await apiService.getHistoricoByUsuario(child.id);
                allHistorico.push(...response.data);
            }
            // Filter only crisis events
            const crises = allHistorico.filter(h => 
                h.descricao.toLowerCase().includes('crise') || 
                h.descricao.toLowerCase().includes('surto')
            );
            setHistorico(crises);
        } catch (error) {
            console.error('Error loading historico:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        await apiService.logout();
                        setShowProfileModal(false);
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const getChildName = (alunoId: number): string => {
        const child = filhos.find(f => f.id === alunoId);
        return child ? child.nome_completo : 'Filho';
    };

    const renderContent = () => {
        if (loading) {
            return <Text style={styles.loadingText}>Carregando...</Text>;
        }

        switch (activeTab) {
            case 'students':
                return (
                    <>
                        <Text style={styles.text}>Filhos</Text>
                        {filhos.map((child) => (
                            <ChildCard
                                key={child.id}
                                childName={`${child.nome_completo} - Escola Etec`}
                                schoolInfo={child.sala ? `Turma: ${child.sala.nome}` : 'Sem turma'}
                                details=""
                                onPress={() => setActiveTab('situations')}
                            />
                        ))}
                    </>
                );
            case 'situations':
                return (
                    <>
                        <Text style={styles.text}>Remédios dos Filhos</Text>
                        {remedios.map((remedio) => (
                            <ChildCard
                                key={remedio.id}
                                childName={`${getChildName(remedio.aluno_id)} - Escola Etec`}
                                schoolInfo={`${remedio.nome} - ${remedio.dosagem}`}
                                details={remedio.horario || ''}
                                onPress={() => setActiveTab('classes')}
                            />
                        ))}
                    </>
                );
            case 'classes':
                return (
                    <>
                        <Text style={styles.text}>Crises dos Filhos</Text>
                        {historico.map((crise) => (
                            <ChildCard
                                key={crise.id}
                                childName={`${getChildName(crise.usuario_id)} - Escola Etec`}
                                schoolInfo={crise.descricao}
                                details={new Date(crise.criado_em).toLocaleDateString('pt-BR')}
                            />
                        ))}
                    </>
                );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%", marginBottom: 20 }}>
                    <Image source={require("../../assets/images/qr-code.png")} style={styles.QRCODE} />
                    <TouchableOpacity onPress={() => setShowProfileModal(true)}>
                        <Image source={require("../../assets/images/prof.png")} style={styles.photo} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-start', width: "100%" }}>
                    <Text style={styles.headerText}>
                        Olá {userProfile ? userProfile.nome_completo : 'Responsável'}!
                    </Text>
                </View>
            </View>
            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {renderContent()}
                </View>
            </ScrollView>
            <BottomTabBar 
                activeTab={activeTab} 
                onTabPress={setActiveTab}
            />
            
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
                    <View style={styles.modalContent}>
                        <View style={styles.profileInfo}>
                            <Image source={require("../../assets/images/prof.png")} style={styles.modalPhoto} />
                            <Text style={styles.modalName}>
                                {userProfile ? userProfile.nome_completo : 'Responsável'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
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
        height: 'auto',
        width: '100%',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: 'rgba(38, 132, 254, 0.24)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(38, 132, 254, 0.25)',
    },
    headerText: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
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
        borderColor: '#2684FE',
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
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 15,
        minWidth: 250,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalPhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#2684FE',
        marginBottom: 10,
    },
    modalName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#FF4444',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
});