import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import LogoutModal from "../../../../utils/LogoutModal";

export default function Wsmanagement() {
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

            <Text style={styles.title}>Gestão de Folhas de Obra</Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.buttonsContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/(tabs)/importworksheet?token=${token}&username=${username}&role=${role}` as `${string}:${string}`)}>
                        <Text style={styles.buttonText}>Importar Folha de Obra</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/viewgenericworksheet?token=${token}&username=${username}&role=${role}`)}>
                        <Text style={styles.buttonText}>Visualização genérica de uma Folha de Obra</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/viewdetailedworksheet?token=${token}&username=${username}&role=${role}`)}>
                        <Text style={styles.buttonText}>Visualização detalhada de uma Folha de Obra</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => router.push(`/removeworksheet?token=${token}&username=${username}&role=${role}`)}>
                        <Text style={styles.buttonText}>Remover Folha de Obra</Text>
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