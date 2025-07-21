import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RemoveUser() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [targetId, setTargetId] = useState("");

    const HandleRemoveUser = async () => {
        try {
            const data = await AuthService.removeUser(token, targetId);

            console.log("Conta removida com sucesso:", data);
            Alert.alert('Success', 'Account successfully removed!', [
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
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View style={styles.backButtonContainer}>
                    <BackButton />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Remover Conta</Text>
                        <Text style={styles.heroSubtitle}>
                            Insira o username ou email da conta a ser removida
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Username/Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex.: utilizador@email.com"
                            placeholderTextColor="#999"
                            value={targetId}
                            onChangeText={setTargetId}
                            autoCapitalize="none"
                            keyboardType="default"
                        />

                        <TouchableOpacity
                            style={styles.button}
                            onPress={HandleRemoveUser}
                            disabled={!targetId}
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
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#fff',
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