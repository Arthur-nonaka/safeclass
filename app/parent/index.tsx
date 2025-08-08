import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomTabBar from "../../components/BottomTabBar";
import ChildCard from "../../components/ChildCard";

export default function ParentIndex() {
    const [activeTab, setActiveTab] = useState<'classes' | 'students' | 'situations'>('students');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();

    const childrenData = [
        { 
            childName: "Gustavo - Escola Etec",
            schoolInfo: "Turma: 3 DS-AMS",
            details: ""
        },
        { 
            childName: "Pedro - Etec Prof. Dr Antônio...",
            schoolInfo: "Turma: 3 DS-AMS",
            details: ""
        },
    ];

    const medicineData = [
        { 
            childName: "Gustavo - Escola Etec",
            schoolInfo: "Tomar Rosuvastatina 1/4 de pílula",
            details: ""
        },
        { 
            childName: "Pedro - Etec Prof. Dr Antônio...",
            schoolInfo: "Tomar 15 gts Diploma as 14h",
            details: ""
        },
    ];

    const crisisData = [
        { 
            childName: "Gustavo - Escola Etec",
            schoolInfo: "Surto de Ansiedade",
            details: ""
        },
        { 
            childName: "Pedro - Etec Prof. Dr Antônio...",
            schoolInfo: "Crise de Asma",
            details: ""
        },
    ];

    const handleLogout = () => {
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
                    onPress: () => {
                        setShowProfileModal(false);
                        router.replace('/');
                    }
                }
            ]
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'students':
                return (
                    <>
                        <Text style={styles.text}>Filhos</Text>
                        {childrenData.map((child, index) => (
                            <ChildCard
                                key={index}
                                childName={child.childName}
                                schoolInfo={child.schoolInfo}
                                details={child.details}
                                onPress={() => setActiveTab('situations')}
                            />
                        ))}
                    </>
                );
            case 'situations':
                return (
                    <>
                        <Text style={styles.text}>Remédios dos Filhos</Text>
                        {medicineData.map((medicine, index) => (
                            <ChildCard
                                key={index}
                                childName={medicine.childName}
                                schoolInfo={medicine.schoolInfo}
                                details={medicine.details}
                                onPress={() => setActiveTab('classes')}
                            />
                        ))}
                    </>
                );
            case 'classes':
                return (
                    <>
                        <Text style={styles.text}>Crises dos Filhos</Text>
                        {crisisData.map((crisis, index) => (
                            <ChildCard
                                key={index}
                                childName={crisis.childName}
                                schoolInfo={crisis.schoolInfo}
                                details={crisis.details}
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
                    <Text style={styles.headerText}>Ola Mãe Exemplo!</Text>
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
                            <Text style={styles.modalName}>Mãe Exemplo</Text>
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
});