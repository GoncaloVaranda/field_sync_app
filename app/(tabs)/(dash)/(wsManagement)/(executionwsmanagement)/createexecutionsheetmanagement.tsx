import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import LogoutModal from "../../../../utils/LogoutModal";
import WorksheetService from "@/services/SheetsIntegration";

export default function Executionwsmanagement() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();
    const [worksheetId, setWorksheetId] = useState("");

    const handleCreateExecutionSheet = async () => {
        if (!worksheetId) {
            Alert.alert("Error", "Please enter a worksheet ID");
            return;
        }

        const id = parseInt(worksheetId);
        if (isNaN(id)) {
            Alert.alert("Error", "Worksheet ID must be a number");
            return;
        }

        try {
            const data = await WorksheetService.createExecutionWorksheet(token.toString(), id);

            Alert.alert("Success", "Execution sheet created successfully: ", data);
            setWorksheetId("");
        } catch (error) {
            // @ts-ignore
            Alert.alert("Error", error.message || "An error occurred while creating the execution sheet");
            console.error(error);
        }
    };

    return (
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
                    <Text style={styles.label}>Worksheet ID:</Text>
                    <TextInput
                        style={styles.input}
                        value={worksheetId}
                        onChangeText={setWorksheetId}
                        keyboardType="numeric"
                        placeholder="Enter worksheet ID"
                    />

                    <Pressable
                        style={styles.button}
                        onPress={handleCreateExecutionSheet}>
                        <Text style={styles.buttonText}>Criar Folha de Execução</Text>
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
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        fontSize: 16,
        color: '#333',
    },
});