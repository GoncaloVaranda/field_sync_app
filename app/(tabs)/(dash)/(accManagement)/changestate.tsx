import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ChangeState() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [targetUsername, setTargetUsername] = useState("");
    const [state, setState] = useState("");

    const HandleChangeState = async () => {
        try {
            const data = await AuthService.changeState(
                token,
                targetUsername,
                state
            );

            console.log("Estado da conta alterado com sucesso:", data);
            Alert.alert('Success', 'Account state successfully changed!', [
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
                <BackButton/>
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Alterar estado de conta</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.smallerText}>Escreva o Username da conta alvo à alteração, e selecione o novo estado da conta.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome de utilizador alvo"
                        placeholderTextColor="#999"
                        value={targetUsername}
                        onChangeText={setTargetUsername}
                        autoCapitalize="none"
                    />

                    <View style={styles.stateOption}>
                        <Text style={styles.stateText}>Definir privacidade:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={state}
                                onValueChange={(value) => setState(value)}
                                style={styles.picker}
                                dropdownIconColor="#6B7A3E"
                            >
                                <Picker.Item label="Activate" value="active" />
                                <Picker.Item label="Suspended" value="suspended" />
                                <Picker.Item label="Deactivate" value="disabled" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar alteração"
                            onPress={HandleChangeState}
                            disabled={!targetUsername || !state}
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
        paddingBottom: 40,
    },
    mainContent: {
        marginTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: '#1e293b',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        padding: 25,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginTop: 20,
    },
    input: {
        height: 50,
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#ffffff',
        color: '#334155',
    },
    smallerText: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 25,
        lineHeight: 20,
    },
    stateOption: {
        marginBottom: 20,
    },
    stateText: {
        fontSize: 16,
        color: '#334155',
        marginBottom: 10,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#334155',
    },
    buttonContainer: {
        marginTop: 10,
        borderRadius: 25,
        overflow: 'hidden',
    },
});