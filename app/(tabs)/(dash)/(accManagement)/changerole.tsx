import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/Integration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const ChangeRole = () => {

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
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.backButtonWrapper}>
                    <BackButton/>
                </View>

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

                    TODO: Picker para Tipo de Conta!

                    <TextInput style={styles.input} placeholder="Novo tipo de conta" placeholderTextColor="#999" value={role} onChangeText={setRole} autoCapitalize="none"/>

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
    backButtonWrapper: {
        position: 'absolute',
        top: 40,
        left: 15,
        zIndex: 10,
    },
    mainContent: {
        marginTop: 80,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
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
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
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

export default ChangeRole;