
import { ImageBackground } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Index() {
  const router = useRouter();
  const [userType, setUserType] = useState<'teacher' | 'parent'>('teacher');

  const handleLogin = () => {
    if (userType === 'teacher') {
      router.push('/teacher');
    } else {
      router.push('/parent');
    }
  };

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
          <View style={styles.userTypeContainer}>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'teacher' && styles.activeUserType]} 
              onPress={() => setUserType('teacher')}
            >
              <Text style={[styles.userTypeText, userType === 'teacher' && styles.activeUserTypeText]}>
                Professor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.userTypeButton, userType === 'parent' && styles.activeUserType]} 
              onPress={() => setUserType('parent')}
            >
              <Text style={[styles.userTypeText, userType === 'parent' && styles.activeUserTypeText]}>
                Responsável
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Login" />
            <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <LinearGradient
              colors={['#4FA8FF', '#2684FE', '#1E6BDB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>ENTRAR</Text>
            </LinearGradient>
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
    backgroundColor: '#2684FE',
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
    gap: 20,
    height: '70%',
  },
  userTypeContainer: {
    flexDirection: 'row',
    width: '80%',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    padding: 4,
    marginBottom: 10,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeUserType: {
    backgroundColor: '#2684FE',
  },
  userTypeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeUserTypeText: {
    color: '#FFF',
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
    height: 50,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 5,
  },
  textPassword: {
    color: '#2684FE',
    fontSize: 18,
    fontWeight: "300",
  }
})

