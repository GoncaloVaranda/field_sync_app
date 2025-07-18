import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ChangeStateToRemovalRequest() {

    const router = useRouter();
    const {token, username} = useLocalSearchParams();


    const confirMationButton = () => {
        Alert.alert(
                'Confirmar',
                'Tens a certeza?',
                [{
                    text: 'Sim',
                    style: 'default',
                    onPress: () => HandleChangeStateToRemovalRequest(),
                },
                {
                    text: 'Não',
                    style: 'cancel',
                },],
            );
    }

    const HandleChangeStateToRemovalRequest = async () => {
        try {
            
            
            const data = await AuthService.changeStateToRemovalRequest(
                token
            );

            console.log("Pedido de remoção efetuado com sucesso:", data);
            Alert.alert('Success', 'Pedido de remoção efetuado', [
                {text: 'OK'},
            ]);
            
            router.dismissTo('/');
            
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
                    <Text style={styles.title}>Pedir Remoção da Conta</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.smallerText}>Deseja efetuar a remoção da sua conta? </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Confirmar remoção"
                            onPress={confirMationButton}
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