import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Changepassword() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();

    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmation: ''
    });
    const [message, setMessage] = useState<{type: string, text: string} | null>(null);

    const handleChange = (name: string, value: string) => {
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleChangePassword = async () => {
        setMessage(null);

        if (form.newPassword !== form.confirmation) {
            setMessage({ type: 'error', text: 'As passwords não coincidem.' });
            return;
        }

        try {
            const data = await AuthService.changePassword(
                token,
                form.currentPassword,
                form.newPassword,
                form.confirmation
            );

            console.log("Palavra-Passe alterada com sucesso:", data);
            setMessage({ type: 'success', text: 'Password alterada com sucesso!' });

            setTimeout(() => router.back(), 1500);

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
            setMessage({ type: 'error', text: errorMessage });
            console.log("Error:", err);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <BackButton/>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Alterar Password</Text>
                        <Text style={styles.heroSubtitle}>Defina uma nova password para a sua conta</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {message && (
                            <View style={[styles.message, message.type === 'error' ? styles.errorMessage : styles.successMessage]}>
                                <Text style={styles.messageText}>{message.text}</Text>
                            </View>
                        )}

                        <Text style={styles.label}>Password Atual</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={form.currentPassword}
                            onChangeText={(text) => handleChange('currentPassword', text)}
                            secureTextEntry
                        />

                        <Text style={styles.label}>Nova Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={form.newPassword}
                            onChangeText={(text) => handleChange('newPassword', text)}
                            secureTextEntry
                        />

                        <Text style={styles.label}>Confirmar Nova Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#999"
                            value={form.confirmation}
                            onChangeText={(text) => handleChange('confirmation', text)}
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleChangePassword}
                            disabled={!form.currentPassword || !form.newPassword || !form.confirmation}
                        >
                            <Text style={styles.buttonText}>Confirmar Alteração</Text>
                        </TouchableOpacity>
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
    scrollContainer: {
        flexGrow: 1,
    },
    headerContainer: {
        paddingHorizontal: 25,
        paddingTop: 40,
    },
    backButton: {
        alignSelf: 'flex-start',
    },
    contentContainer: {
        paddingHorizontal: 25,
    },
    hero: {
        marginBottom: 40,
        marginTop: 20,
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
        marginTop: 20,
        marginBottom: 40,
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
});