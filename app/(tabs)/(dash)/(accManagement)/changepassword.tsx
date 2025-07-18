import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";


export default function Changepassword() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();

    const [currentPassword, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [newPassword, setNewPassword] = useState("")

    const handleChangePassword = async () => {

        try {
            const data = await AuthService.changePassword(
                token,
                currentPassword,
                newPassword,
                confirmation
            );

            console.log("Palavra-Passe alterada com sucesso:", data);
            Alert.alert('Success', 'Password successfully changed!', [
                {text: 'OK'},
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

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Alterar Password</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.smallerText}>Preencha os parâmetros da Password e Confirmação da mesma para
                        alterar os atributos </Text>
                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" value={currentPassword}
                               onChangeText={setPassword} secureTextEntry/>
                    <TextInput style={styles.input} placeholder="Password Nova" placeholderTextColor="#999" value={newPassword}
                               onChangeText={setNewPassword} secureTextEntry/>
                    <TextInput style={styles.input} placeholder="Confirmação de Password" placeholderTextColor="#999" value={confirmation}
                               onChangeText={setConfirmation} secureTextEntry/>

                    <Text style={styles.smallerText}></Text>


                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar alterações"
                            onPress={handleChangePassword}
                            disabled={!currentPassword || !confirmation || !newPassword}
                        />
                    </View>
                </View>

                <BackButton/>
                
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
    sectionLabelText: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 25,
        marginBottom: 10,
        color: "#555",
    },
});