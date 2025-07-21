import React from 'react';
import { useRouter } from 'expo-router';
import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChangeStateToRemovalRequest() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();

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
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.backButtonContainer}>
                    <BackButton />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Pedir Remoção da Conta</Text>
                        <Text style={styles.heroSubtitle}>
                            Confirme se deseja efetuar a remoção da sua conta
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.warningText}>
                            Deseja efetuar a remoção da sua conta? Esta ação irá enviar um pedido de remoção.
                        </Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={confirMationButton}
                        >
                            <Text style={styles.buttonText}>Confirmar Remoção</Text>
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
    backButtonContainer: {
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    contentContainer: {
        paddingHorizontal: 25,
        paddingTop: 80,
    },
    hero: {
        marginBottom: 30,
        marginTop: 10,
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
    warningText: {
        fontSize: 16,
        color: '#34495e',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    button: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});