import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ChangeRole() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [targetUsername, setTargetUsername] = useState("");
    const [role, setRole] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChangeRole = async () => {
        setIsSubmitting(true);
        try {
            const data = await AuthService.changeRole(
                token,
                targetUsername,
                role
            );

            console.log("Tipo de conta alterado com sucesso:", data);
            Alert.alert('Sucesso', 'Tipo de conta alterado com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => router.back()
                },
            ]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message, [
                    {text: 'Entendi'},
                ]);
            } else {
                console.log("Unexpected error:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <BackButton/>
                </View>

                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Alterar Tipo de Conta</Text>
                    <Text style={styles.heroSubtitle}>
                        Defina um novo tipo de conta para um utilizador específico
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Nome de Utilizador</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o nome do utilizador"
                        placeholderTextColor="#94a3b8"
                        value={targetUsername}
                        onChangeText={setTargetUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Novo Tipo de Conta</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={role}
                            onValueChange={(itemValue) => setRole(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#64748b"
                        >
                            <Picker.Item label="Selecione um tipo de conta..." value="" enabled={false} />
                            <Picker.Item label="Registered User" value="Registered User" />
                            <Picker.Item label="Adherent Landowner User" value="Adherent Landowner User" />
                            <Picker.Item label="Partner Operator" value="Partner Operator" />
                            <Picker.Item label="Partner Representative Back-Office" value="Partner Representative Back-Office" />
                            <Picker.Item label="Sheet General Viewer Back-Office" value="Sheet General Viewer Back-Office" />
                            <Picker.Item label="Sheet Detailed Viewer Back-Office" value="Sheet Detailed Viewer Back-Office" />
                            <Picker.Item label="Sheet Manager Back-Office" value="Sheet Manager Back-Office" />
                            <Picker.Item label="System Back-Office" value="System Back-Office" />
                        </Picker>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={isSubmitting ? "A processar..." : "Confirmar alteração"}
                            onPress={handleChangeRole}
                            disabled={!targetUsername || !role || isSubmitting}
                            color="#6B7A3E"
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        zIndex: 1,
    },
    header: {
        marginTop: 20,
        paddingTop: 200,
    },
    hero: {
        marginTop: 20,
        marginBottom: 40,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        color: '#0f172a',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: "center",
        color: '#64748b',
    },
    formContainer: {
        width: '100%',
        marginBottom: 40,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0f172a',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 25,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#0f172a',
    },
    pickerContainer: {
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 25,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: '#0f172a',
    },
    buttonContainer: {
        marginTop: 15,
        marginBottom: 30,
        borderRadius: 8,
        overflow: 'hidden',
    },
    infoBox: {
        marginTop: 30,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    roleInfo: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#10b981',
        marginBottom: 10,
    },
    roleName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10b981',
        marginBottom: 4,
    },
    roleDesc: {
        fontSize: 13,
        color: '#64748b',
    },
});