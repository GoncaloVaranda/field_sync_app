import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CheckAccountState() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [targetUsername, setTargetUsername] = useState("");
    const [accountData, setAccountData] = useState<any>(null);
    const [message, setMessage] = useState<{type: string, text: string} | null>(null);

    const handleCheckAccountState = async () => {
        setMessage(null);
        setAccountData(null);

        try {
            const data = await AuthService.checkAccountState(
                token,
                targetUsername,
            );

            console.log("Estado da conta apresentado com sucesso.", data);
            setAccountData(data);
            setMessage({ type: 'success', text: 'Estado da conta apresentado com sucesso!' });

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
            setMessage({ type: 'error', text: errorMessage });
            console.log("Error:", err);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.backButtonContainer}>
                    <BackButton />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Verificar Estado da Conta</Text>
                        <Text style={styles.heroSubtitle}>
                            Insira o nome de utilizador para consultar o estado atual
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex.: juliocunha"
                            placeholderTextColor="#999"
                            value={targetUsername}
                            onChangeText={setTargetUsername}
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleCheckAccountState}
                            disabled={!targetUsername}
                        >
                            <Text style={styles.buttonText}>Verificar</Text>
                        </TouchableOpacity>

                        {message && (
                            <View style={[styles.message, message.type === 'error' ? styles.errorMessage : styles.successMessage]}>
                                <Text style={styles.messageText}>{message.text}</Text>
                            </View>
                        )}

                        {accountData && (
                            <View style={styles.resultContainer}>
                                <Text style={styles.resultTitle}>Dados da Conta:</Text>
                                <Text style={styles.resultText}><Text style={styles.resultLabel}>Username:</Text> {accountData.username}</Text>
                                <Text style={styles.resultText}><Text style={styles.resultLabel}>Nome:</Text> {accountData.name}</Text>
                                <Text style={styles.resultText}><Text style={styles.resultLabel}>ID:</Text> {accountData.id}</Text>
                                <Text style={styles.resultText}><Text style={styles.resultLabel}>Estado:</Text> {accountData.state}</Text>
                                <Text style={styles.resultText}><Text style={styles.resultLabel}>Role:</Text> {accountData.role}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    backButtonContainer: {
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    contentContainer: {
        paddingHorizontal: 25,
        paddingTop: 80,
    },
    hero: {
        marginBottom: 30,
        marginTop: 10,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        marginTop: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6B7A3E',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    message: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    errorMessage: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    successMessage: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    messageText: {
        fontSize: 14,
        textAlign: 'center',
    },
    resultContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2c3e50',
    },
    resultText: {
        marginBottom: 8,
        color: '#2c3e50',
    },
    resultLabel: {
        fontWeight: '500',
        color: '#7f8c8d',
    },
});