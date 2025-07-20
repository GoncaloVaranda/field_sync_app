import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import WorksheetService from "@/services/SheetsIntegration";

export default function ExportExecutionSheet() {
    const router = useRouter();
    const { token } = useLocalSearchParams();

    const [worksheetId, setWorksheetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!worksheetId.trim()) {
            Alert.alert('Erro', 'Por favor, insira o ID da Folha de Obra', [
                {text: 'OK'}
            ]);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Call the service method
            const data = await WorksheetService.exportExecutionSheet(
                token,
                parseInt(worksheetId, 10)
            );

            // Prepare the file
            const jsonStr = JSON.stringify(data, null, 2);
            const fileUri = FileSystem.documentDirectory + `execution_sheet_${worksheetId}.json`;

            // Save the file
            await FileSystem.writeAsStringAsync(fileUri, jsonStr);

            // Share the file
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: `Exportar Folha de Execução ${worksheetId}`,
                UTI: 'public.json'
            });

            setSuccessMessage('Folha de execução exportada com sucesso!');

        } catch (err) {
            console.error('Export error:', err);
            let errorMessage = 'Ocorreu um erro ao exportar a folha de execução';

            if (err instanceof Error) {
                errorMessage = err.message;
                // Handle specific error cases if needed
                if (errorMessage.includes('401')) {
                    errorMessage = 'Autenticação falhou. Por favor, faça login novamente.';
                } else if (errorMessage.includes('404')) {
                    errorMessage = 'Folha de execução não encontrada. Verifique o ID.';
                }
            }

            setError(errorMessage);
            Alert.alert('Erro', errorMessage, [{ text: 'OK' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setWorksheetId("");
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Exportar Folha de Execução</Text>
                    <Text style={styles.subtitle}>
                        Insira o ID da folha de obra para exportar os dados
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Folha de Obra *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o ID da folha de obra"
                            value={worksheetId}
                            onChangeText={setWorksheetId}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <View style={styles.halfButton}>
                            <Button
                                title="Limpar"
                                onPress={clearForm}
                                disabled={isLoading}
                                color="#FF3B30"
                            />
                        </View>
                        <View style={styles.halfButton}>
                            <Button
                                title={isLoading ? "Exportando..." : "Exportar"}
                                onPress={handleSubmit}
                                disabled={isLoading}
                                color="#007AFF"
                            />
                        </View>
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {successMessage && (
                        <View style={styles.successContainer}>
                            <Text style={styles.successText}>{successMessage}</Text>
                        </View>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Informações Importantes:</Text>
                        <Text style={styles.infoText}>• O campo marcado com * é obrigatório</Text>
                        <Text style={styles.infoText}>• Certifique-se de que o ID existe no sistema</Text>
                        <Text style={styles.infoText}>• Os dados serão exportados em formato JSON</Text>
                        <Text style={styles.infoText}>• Você poderá compartilhar o arquivo após a exportação</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    mainContent: {
        marginTop: 80,
        paddingBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: '#666',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 10,
    },
    halfButton: {
        flex: 1,
    },
    infoContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        marginTop: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        lineHeight: 20,
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    successContainer: {
        backgroundColor: '#E8F5E9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#34C759',
    },
    successText: {
        color: '#34C759',
        fontSize: 16,
    },
});