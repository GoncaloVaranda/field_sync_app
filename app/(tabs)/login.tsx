
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import AuthService from "../../services/UsersIntegration";
import BackButton from "../utils/back_button";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLogin = async ()=> {
        setIsLoading(true);
        try {   
        const data = await AuthService.login(username, password);
        // ex.: guarda token em AsyncStorage, contexto global, etc.
        console.log("Token recebido:");
        
        // navega para a próxima página
        router.push(`/dashboard?token=${data.token}&username=${username}&role=${data.role}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Error', err.message, [
                            { text: 'I understand' },
                            ]);
            } else {
                console.log("Erro inesperado:", err);
            }
          } finally {
              setIsLoading(false);
          }
  };

    return (
        <View style={styles.container}>
            <BackButton/>

            <Text style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 20,
                justifyContent: "center",
            }}>Login</Text>
            

            <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

            <TextInput
        style={styles.input}
        placeholder="Palavra-passe"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
       
          
        {isLoading ? (
          <ActivityIndicator size="large" color="#51ff009f" />
          ) : (
          <Button title="Iniciar sessão" onPress={handleLogin} color="#51ff009f" />
        )}
            

        </View>
        
        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",        // centra verticalmente
    paddingHorizontal: 30,
  },
  input: {
    height: 50,                       // altura mínima para o placeholder aparecer
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
});

export default Login;
