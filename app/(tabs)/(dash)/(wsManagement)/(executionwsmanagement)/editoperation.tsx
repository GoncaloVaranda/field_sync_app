import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

export default function EditOperations() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const [worksheetId, setWorksheetId] = useState("");
    const [operationId, setOperationId] = useState("");
    const [ruralPropertyId, setRuralPropertyId] = useState("");
    const [polygonId, setPolygonId] = useState("");
    const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");
    const [estimatedDuration, setEstimatedDuration] = useState("");
    const [notes, setNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        if (!worksheetId.trim() || !operationId.trim() || !ruralPropertyId.trim() || !polygonId.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios', [
                { text: 'OK' }
            ]);
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const payload = {
                token,
                worksheetId,
                operationId,
                ruralPropertyId,
                polygonId,
                estimatedCompletionDate,
                estimatedDuration,
                notes
            };

            await WorksheetService.editOperation(payload);
            setMessage({ type: 'success', text: 'Operação editada com sucesso!' });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setWorksheetId("");
        setOperationId("");
        setRuralPropertyId("");
        setPolygonId("");
        setEstimatedCompletionDate("");
        setEstimatedDuration("");
        setNotes("");
        setMessage(null);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Editar Operação</Text>
                    <Text style={styles.subtitle}>
                        Atualize os dados da operação conforme necessário
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Informações da Operação</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Folha de Obra *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o ID da folha de obra"
                            value={worksheetId}
                            onChangeText={setWorksheetId}
                            keyboardType="numeric"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Código da Operação *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o código da operação"
                            value={operationId}
                            onChangeText={setOperationId}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Propriedade Rural *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o ID da propriedade rural"
                            value={ruralPropertyId}
                            onChangeText={setRuralPropertyId}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID do Polígono *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o ID do polígono"
                            value={polygonId}
                            onChangeText={setPolygonId}
                            keyboardType="numeric"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Data Prevista de Conclusão</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex.: 31/12/2025"
                            value={estimatedCompletionDate}
                            onChangeText={setEstimatedCompletionDate}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Duração Estimada</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex.: 2h 30m"
                            value={estimatedDuration}
                            onChangeText={setEstimatedDuration}
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Observações</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="Notas adicionais"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
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
                                title={isLoading ? "Salvando..." : "Salvar"}
                                onPress={handleSubmit}
                                disabled={isLoading}
                                color="#007AFF"
                            />
                        </View>
                    </View>

                    {message && (
                        <View style={[
                            styles.messageContainer,
                            message.type === 'success' ? styles.successMessage : styles.errorMessage
                        ]}>
                            <Text style={styles.messageText}>{message.text}</Text>
                        </View>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Informações Importantes:</Text>
                        <Text style={styles.infoText}>• Campos marcados com * são obrigatórios</Text>
                        <Text style={styles.infoText}>• Certifique-se de que os IDs existem no sistema</Text>
                        <Text style={styles.infoText}>• A data deve estar no formato AAAA-MM-DD</Text>
                        <Text style={styles.infoText}>• Verifique os dados antes de salvar</Text>
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
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
    messageContainer: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
    },
    successMessage: {
        backgroundColor: '#E8F5E9',
        borderLeftColor: '#34C759',
    },
    errorMessage: {
        backgroundColor: '#FFEBEE',
        borderLeftColor: '#FF3B30',
    },
    messageText: {
        fontSize: 16,
    },
});