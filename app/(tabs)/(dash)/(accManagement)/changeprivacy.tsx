import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import LogoutModal from "../../../utils/LogoutModal";

export default function Changeprivacy() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();
    const [privacy, setPrivacy] = useState("");

    const handleChangePrivacy = async () => {
        if (!privacy) {
            Alert.alert('Erro', 'Por favor, selecione uma opção de privacidade', [
                {text: 'Entendi'},
            ]);
            return;
        }

        try {
            const data = await AuthService.changePrivacy(
                token,
                privacy
            );

            console.log("Privacidade alterada com sucesso:", data);
            Alert.alert('Sucesso', 'Privacidade alterada com sucesso!', [
                {text: 'OK'},
            ]);
            router.back();

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message, [
                    {text: 'Entendi'},
                ]);
            } else {
                console.log("Erro inesperado:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado', [
                    {text: 'OK'},
                ]);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Cabeçalho com botões */}
            <View style={styles.header}>
                <BackButton />
                <LogoutModal
                    username={username?.toString()}
                    token={token?.toString()}
                    role={role?.toString()}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Alterar Privacidade</Text>
                    <Text style={styles.subtitle}>
                        Escolha entre perfil público ou privado
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.privacyOption}>
                        <Text style={styles.label}>Configuração de privacidade:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={privacy}
                                onValueChange={(value) => setPrivacy(value)}
                                style={styles.picker}
                                dropdownIconColor="#6B7A3E"
                            >
                                <Picker.Item label="Selecione..." value="" />
                                <Picker.Item label="Público" value="public" />
                                <Picker.Item label="Privado" value="private" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar alterações"
                            onPress={handleChangePrivacy}
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
        position: 'relative',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 200,
        zIndex: 10,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
    },
    mainContent: {
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: '#1e293b',
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: '#64748b',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    privacyOption: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    buttonContainer: {
        marginTop: 16,
    }
});