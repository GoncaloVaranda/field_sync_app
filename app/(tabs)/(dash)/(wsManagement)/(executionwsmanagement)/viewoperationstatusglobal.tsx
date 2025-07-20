import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

export default function ViewOperationStatusGlobal() {
    const {token, username, role} = useLocalSearchParams();

    const [operationId, setOperationId] = useState("");
    const [worksheetId, setWorksheetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleViewOperationStatusGlobal = async () => {
        if (!operationId.trim() || !worksheetId.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios', [
                {text: 'OK'}
            ]);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await WorksheetService.viewOperationStatusGlobal(
                token,
                worksheetId,
                operationId
            );

            console.log("Status global da operação mostrado com sucesso:", data);
            setResult(data);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                setError(err.message);
            } else {
                console.log("Erro inesperado:", err);
                setError('Ocorreu um erro inesperado');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setOperationId("");
        setWorksheetId("");
        setResult(null);
        setError(null);
    };

    const getStatusStyle = (status?: string) => {
        if (!status) return styles.statusText;

        const statusLower = status.toString().toLowerCase();

        const statusColors: Record<string, string> = {
            'imported': '#8E8E93',
            'created': '#5AC8FA',
            'pending': '#FF9500',
            'unassigned': '#FF3B30',
            'assigned': '#5856D6',
            'in_progress': '#007AFF',
            'completed': '#34C759',
            'scheduled': '#AF52DE',
        };

        const matchedKey = Object.keys(statusColors).find(key =>
            statusLower.includes(key.toLowerCase())
        );

        return {
            ...styles.statusText,
            color: matchedKey ? statusColors[matchedKey] : '#333'
        };
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Consultar Status Global da Operação</Text>
                    <Text style={styles.subtitle}>
                        Preencha os dados necessários para consultar o status global de uma operação
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
                            autoCapitalize="none"
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
                                title={isLoading ? "Consultando..." : "Consultar Status"}
                                onPress={handleViewOperationStatusGlobal}
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

                    {result && (
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultTitle}>Resumo da Operação {result.operation_id}</Text>

                            <View style={styles.summaryContainer}>
                                <Text style={styles.summaryText}>
                                    <Text style={styles.detailLabel}>Total de Atribuições: </Text>
                                    {result.summary.total_assignments}
                                </Text>
                                <Text style={styles.summaryText}>
                                    <Text style={styles.detailLabel}>Concluídas: </Text>
                                    {result.summary.COMPLETED || 0}
                                </Text>
                                <Text style={styles.summaryText}>
                                    <Text style={styles.detailLabel}>Em Progresso: </Text>
                                    {result.summary.IN_PROGRESS || 0}
                                </Text>
                                <Text style={styles.summaryText}>
                                    <Text style={styles.detailLabel}>Pendentes: </Text>
                                    {result.summary.PENDING || 0}
                                </Text>
                                <Text style={styles.summaryText}>
                                    <Text style={styles.detailLabel}>Percentual Concluído: </Text>
                                    {result.summary.completion_percentage}%
                                </Text>
                            </View>

                            <Text style={styles.sectionTitle}>Detalhes das Atribuições:</Text>

                            <View style={styles.assignmentsContainer}>
                                {result.assignments.map((assignment: any, index: number) => (
                                    <View key={index} style={styles.assignmentItem}>
                                        <Text style={styles.assignmentDetail}>
                                            <Text style={styles.detailLabel}>Parcela: </Text>
                                            {assignment.feature_id}
                                        </Text>
                                        <Text style={styles.assignmentDetail}>
                                            <Text style={styles.detailLabel}>Operador: </Text>
                                            {assignment.operator_id}
                                        </Text>
                                        <Text style={[styles.assignmentDetail, getStatusStyle(assignment.status)]}>
                                            <Text style={styles.detailLabel}>Status: </Text>
                                            {assignment.status}
                                        </Text>
                                        <Text style={styles.assignmentDetail}>
                                            <Text style={styles.detailLabel}>Início: </Text>
                                            {assignment.start_date}
                                        </Text>
                                        {assignment.end_date && (
                                            <Text style={styles.assignmentDetail}>
                                                <Text style={styles.detailLabel}>Fim: </Text>
                                                {assignment.end_date}
                                            </Text>
                                        )}

                                        {assignment.activities && (
                                            <View style={styles.activitiesSubContainer}>
                                                <Text style={styles.subSectionTitle}>Atividades desta atribuição:</Text>
                                                {Array.isArray(assignment.activities) ? (
                                                    assignment.activities.map((activity: any, actIndex: number) => (
                                                        <View key={actIndex} style={styles.activityItem}>
                                                            <Text style={styles.activityDetail}>
                                                                <Text style={styles.detailLabel}>ID: </Text>
                                                                {activity.id || 'N/A'}
                                                            </Text>
                                                            <Text style={styles.activityDetail}>
                                                                <Text style={styles.detailLabel}>Início: </Text>
                                                                {activity.starting_date || activity.start_date || 'Não informado'}
                                                            </Text>
                                                            {activity.activity_end && (
                                                                <Text style={styles.activityDetail}>
                                                                    <Text style={styles.detailLabel}>Fim: </Text>
                                                                    {activity.activity_end}
                                                                </Text>
                                                            )}
                                                        </View>
                                                    ))
                                                ) : (
                                                    <Text style={styles.activityDetail}>Nenhuma atividade registrada</Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Informações Importantes:</Text>
                        <Text style={styles.infoText}>• Todos os campos marcados com * são obrigatórios</Text>
                        <Text style={styles.infoText}>• O ID da folha de obra deve ser numérico</Text>
                        <Text style={styles.infoText}>• O sistema retornará um resumo global da operação</Text>
                        <Text style={styles.infoText}>• Verifique se os dados estão corretos antes de consultar</Text>
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
    resultContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    summaryContainer: {
        marginVertical: 12,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    summaryText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: '600',
        color: '#333',
    },
    assignmentsContainer: {
        marginTop: 12,
    },
    assignmentItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
    },
    assignmentDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    activitiesSubContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    subSectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        color: '#444',
    },
    activityItem: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    activityDetail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 3,
    },
});