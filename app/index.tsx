
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.backgroundImage}>
      <View
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Seja Bem vindo !
          </Text>
          <Svg height="90" width="100%" viewBox="0 0 500 90" style={styles.wave}>
            <Path
              d="M0.00,49.98 C150.00,150.00 349.92,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
              fill="#fff"
            />
          </Svg>
        </View>
        <View style={styles.main}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Login" />
            <TextInput style={styles.input} placeholder="Senha" />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/teacher')}>
            <Text style={styles.buttonText}>ENTRAR</Text>
          </TouchableOpacity>
          <Text style={styles.textPassword}> Esqueceu a senha ?</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  header: {
    height: '30%',
    backgroundImage: 'linear-gradient(160deg, #2684FE, #00c6ff)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wave: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    height: 100,
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    height: '70%',
  },
  inputContainer: {
    width: '100%',
    height: "auto",
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 200,
    gap: 10,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2d9cdb',
  },
  button: {
    width: '80%',
    backgroundColor: '#2684FE',
    height: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 50,
    fontWeight: 'bold',
    letterSpacing: 5,
  },
  textPassword: {
    color: '#2684FE',
    fontSize: 18,
    fontWeight: "light",
  }
})

