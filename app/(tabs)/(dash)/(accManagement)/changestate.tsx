import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/Integration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {useState} from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {Picker} from "@react-native-picker/picker";

const changeState = () => {

    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [targetUsername, setTargetUsername] = useState("");
    const [state, setState] = useState("");

    const handleChangeState = async () => {
        try {
            const data = await AuthService.changeRole(
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
                    <Text style={styles.smallerText}>Escreva o Username da conta alvo à alteração, e selecione o novo estado da conta. </Text>

                    <TextInput style={styles.input} placeholder="Nome de utilizador alvo" placeholderTextColor="#999" value={targetUsername} onChangeText={setTargetUsername} autoCapitalize="none"/>

                    <View style={styles.stateOption}>
                        <Text style={styles.stateText}>Definir privacidade:</Text>
                        <Picker selectedValue={state} onValueChange={(value) => setState(value)}>
                            <Picker.Item label="Pedido de remoção" value="removal request" />
                            <Picker.Item label="Activa" value="active" />
                            <Picker.Item label="Suspensa" value="suspended" />
                            <Picker.Item label="Desactiva" value="disabled" />
                        </Picker>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar alteração"
                            onPress={handleChangeState}
                            disabled={!targetUsername || !state}
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
    stateOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    stateText: {
        fontSize: 16,
        color: '#333',
    },

});


export default changeState;