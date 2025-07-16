import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/Integration";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const Changeprivacy = () => {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [privacy, setPrivacy] = useState("");

    const handleChangePrivacy = async () => {

        try {
            const data = await AuthService.changePrivacy(
                token,
                privacy
            );

            console.log("Privacidade alterada com sucesso:", data);
            Alert.alert('Success', 'Privacy successfully changed!', [
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
                <View style={styles.backButtonWrapper}>
                    <BackButton/>
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Alterar Privacidade</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.smallerText}>
                        Altere as configurações de privacidade da sua conta. Selecione entre público e privado.
                    </Text>

                    <View style={styles.privacyOption}>
                        <Text style={styles.privacyText}>Definir privacidade:</Text>
                        <Picker selectedValue={privacy} onValueChange={(value) => setPrivacy(value)}>
                            <Picker.Item label="Público" value="public" />
                            <Picker.Item label="Privado" value="private" />
                        </Picker>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar alterações"
                            onPress={handleChangePrivacy}
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
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
    },
    privacyOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    privacyText: {
        fontSize: 16,
        color: '#333',
    },

});

export default Changeprivacy;