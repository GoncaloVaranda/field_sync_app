import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/Integration";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ChangeRole() {

    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [targetUsername, setTargetUsername] = useState("");
    const [role, setRole] = useState("");


    const handleChangeRole = async () => {
        try {
            const data = await AuthService.changeRole(
                token,
                targetUsername,
                role
            );

            console.log("Tipo de conta alterado com sucesso:", data);
            Alert.alert('Success', 'Attributes successfully changed!', [
                { text: 'OK' },
            ]);
            router.back();
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Error', err.message, [
                    {text: 'I understand'},
                ]);
            } else {
                console.log("Unexpected error:", err);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <BackButton/>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Alterar tipo de Conta</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.smallerText}>Escreva o Username da conta alvo à alteração, e selecione o novo tipo de conta. </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome de utilizador alvo"
                        placeholderTextColor="#999"
                        value={targetUsername}
                        onChangeText={setTargetUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.title}>Tipo de Conta:</Text>

                    <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.input}>
                    <Picker.Item label="Registered User" value="Registered User" />
                    <Picker.Item label="Adherent Landowner User" value="Adherent Landowner User" />
                    <Picker.Item label="Partner Operator" value="Partner Operator" />
                    <Picker.Item label="Partner Representative Back-Office" value="Partner Representative Back-Office" />
                    <Picker.Item label="Sheet General Viewer Back-Office" value="Sheet General Viewer Back-Office" />
                    <Picker.Item label="Sheet Detailed Viewer Back-Office" value="Sheet Detailed Viewer Back-Office" />
                    <Picker.Item label="Sheet Manager Back-Office" value="Sheet Manager Back-Office" />
                    <Picker.Item label="System Back-Office" value="System Back-Office" />
                    </Picker>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar alteração"
                            onPress={handleChangeRole}
                            disabled={!targetUsername || !role}
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
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
    },
    mainContent: {
        marginTop: 80,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: '#333',
    },
    smallerText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 30,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
    },
});