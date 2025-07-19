import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import LogoutModal from "../../../../utils/LogoutModal";

export default function Executionwsmanagement() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    return(
        <View style={styles.container}>
            <BackButton/>

            <LogoutModal
                username={username.toString()}
                token={token.toString()}
                role={role?.toString()}
            />

            <Text style={styles.title}>Gestão de Folhas de Execução</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.buttonsContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/createexecutionsheet?token=${token}&username=${username}&role=${role}` as `${string}:${string}`)}>
                        <Text style={styles.buttonText}>Criar Folha de Execução</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/assignoperations?token=${token}&username=${username}&role=${role}` as `${string}:${string}`)}>
                        <Text style={styles.buttonText}>Atribuir operações</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/startactivity?token=${token}&username=${username}&role=${role}` as `${string}:${string}`)}>
                        <Text style={styles.buttonText}>Começar atividade</Text>
                    </Pressable>


                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 80,
    },
    buttonsContainer: {
        marginTop: 30,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'flex-start',
        marginVertical: 8,
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },
});