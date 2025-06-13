import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function TeacherIndex() {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "100%", margin: 10 }}>
                    <Image source={require("../../assets/images/qr-code.png")} style={styles.QRCODE} />
                    <Image source={require("../../assets/images/prof.png")} style={styles.photo} />
                </View>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', width: "100%" }}>
                    <Text style={styles.headerText}>Ola Prof Exemplo</Text>
                </View>
            </View>
            <ImageBackground source={require("../../assets/images/safeclass.png")} style={[styles.main, { opacity: 0.5 }]} resizeMode="contain">
                <Text style={styles.text}>Turmas</Text>
            </ImageBackground >
            <View style={styles.bar}>

            </View>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF",
    },
    header: {
        height: '15%',
        width: 'auto',
        minWidth: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
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
        borderRadius: 26,
        borderWidth: 2,
        borderColor: '#FFF',
        boxShadow: '10px 4px 10px rgba(38, 132, 254, 0.24)',
    },
    main: {
        width: '90%',
        height: '85%',
        marginTop: 20,
        padding: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    bar: {

    }
});
