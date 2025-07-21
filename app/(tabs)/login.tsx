import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthService from "../../services/UsersIntegration";
import BackButton from "../utils/back_button";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const data = await AuthService.login(username, password);
            router.push(`/dashboard?token=${data.token}&username=${username}&role=${data.role}`);
        } catch (err: unknown) {
            if (err instanceof Error) {
                Alert.alert('Error', err.message, [{ text: 'I understand' }]);
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

            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Login</Text>

            <View style={styles.formContainer}>
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
                    <ActivityIndicator size="large" color="#6B7A3E" />
                ) : (
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>Iniciar sessão</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.footerText}>
                Não tem conta? <Text style={styles.linkText} onPress={() => router.push('/register')}>Criar conta</Text>
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        backgroundColor: '#f8fafc',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        color: '#1e293b',
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        height: 50,
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#6B7A3E',
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    footerText: {
        marginTop: 20,
        color: '#64748b',
        fontSize: 14,
    },
    linkText: {
        color: '#6B7A3E',
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
});

export default Login;