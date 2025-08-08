import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomTabBar from "../../components/BottomTabBar";
import ClassCard from "../../components/ClassCard";
import SituationCard from "../../components/SituationCard";
import StudentCard from "../../components/StudentCard";

export default function TeacherIndex() {
    const [activeTab, setActiveTab] = useState<'classes' | 'students' | 'situations'>('classes');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const router = useRouter();

    const classesData = [
        { className: "Sala A - Escola Etec", school: "Americana", studentCount: 30 },
        { className: "Sala B - Escola no Liberdade", school: "Alunos: 28", studentCount: 28 },
    ];

    const studentsData = [
        { name: "Marcos Leopoldo", hasAlert: true },
        { name: "Marcia Leopoldo", hasAlert: true },
        { name: "Marcos Leopoldo", hasAlert: true },
        { name: "Marcos Leopoldo", hasAlert: false },
        { name: "Marcos Leopoldo", hasAlert: true },
        { name: "Marcos Leopoldo", hasAlert: false },
    ];

    const situationsData = [
        { title: "Situação 1" },
        { title: "Situação 2" },
        { title: "Situação 3" },
        { title: "Situação 4" },
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
                        router.push('../');
                    }
                }
            ]
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'classes':
                return (
                    <>
                        <Text style={styles.text}>Turmas</Text>
                        {classesData.map((classItem, index) => (
                            <ClassCard
                                key={index}
                                className={classItem.className}
                                school={classItem.school}
                                studentCount={classItem.studentCount}
                                onPress={() => setActiveTab('students')}
                            />
                        ))}
                    </>
                );
            case 'students':
                return (
                    <>
                        <Text style={styles.text}>Alunos</Text>
                        {studentsData.map((student, index) => (
                            <StudentCard
                                key={index}
                                name={student.name}
                                hasAlert={student.hasAlert}
                                onPress={() => setActiveTab('situations')}
                            />
                        ))}
                    </>
                );
            case 'situations':
                return (
                    <>
                        <Text style={styles.text}>Marcos Leopoldo</Text>
                        {situationsData.map((situation, index) => (
                            <SituationCard
                                key={index}
                                title={situation.title}
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
                        Ola Prof. Exemplo !
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
                            <Text style={styles.modalName}>Prof. Exemplo</Text>
                        </View>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Sair</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View >
    )
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
        shadowColor: '#000000ff',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 2,
        shadowRadius: 4,
        elevation: 5,
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
