import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

export default function ViewOperationStatus() {
    const router = useRouter();
    const {token, username, role} = useLocalSearchParams();

    const [operationId, setOperationId] = useState("");
    const [ruralPropertyId, setRuralPropertyId] = useState("");
    const [polygonId, setPolygonId] = useState("");
    const [worksheetId, setWorksheetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const HandleViewOperationStatus = async () => {
        if (!operationId.trim() || !ruralPropertyId.trim() || !polygonId.trim() || !worksheetId.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios', [
                {text: 'OK'}
            ]);
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await WorksheetService.viewOperationStatus(
                token,
                operationId,
                ruralPropertyId,
                polygonId,
                worksheetId
            );

            console.log("Status da operação mostrado com sucesso:", data);
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
        setRuralPropertyId("");
        setPolygonId("");
        setWorksheetId("");
        setResult(null);
        setError(null);
    };

    const getStatusStyle = (status: string) => {
        const statusLower = status.toLowerCase().replace(' ', '-');
        return {
            ...styles.statusText,
            color:
                statusLower.includes('pendente') ? '#FF9500' :
                    statusLower.includes('concluído') ? '#34C759' :
                        statusLower.includes('cancelado') ? '#FF3B30' :
                            statusLower.includes('andamento') ? '#007AFF' :
                                '#333'
        };
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Consultar Status da Operação</Text>
                    <Text style={styles.subtitle}>
                        Preencha os dados necessários para consultar o status de uma operação
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Informações da Operação</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Operação *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o ID da operação"
                            value={operationId}
                            onChangeText={setOperationId}
                            autoCapitalize="none"
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
                            autoCapitalize="none"
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
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Folha de Obra *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira o ID da folha de obra"
                            value={worksheetId}
                            onChangeText={setWorksheetId}
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
                                onPress={HandleViewOperationStatus}
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
                            <Text style={styles.resultTitle}>Estado Atual:</Text>
                            <Text style={getStatusStyle(result.status)}>{result.status}</Text>

                            <View style={styles.detailsContainer}>
                                {result.execution_start_date && (
                                    <Text style={styles.detailText}>
                                        <Text style={styles.detailLabel}>Início: </Text>
                                        {result.execution_start_date}
                                    </Text>
                                )}
                                {result.execution_end_date && (
                                    <Text style={styles.detailText}>
                                        <Text style={styles.detailLabel}>Fim: </Text>
                                        {result.execution_end_date}
                                    </Text>
                                )}
                            </View>

                            <Text style={styles.activitiesTitle}>Atividades:</Text>
                            {Array.isArray(JSON.parse(result.activities)) && (
                                <View style={styles.activitiesContainer}>
                                    {JSON.parse(result.activities).map((act: any) => (
                                        <View key={act.id} style={styles.activityItem}>
                                            <Text style={styles.activityDetail}>
                                                <Text style={styles.detailLabel}>ID: </Text>
                                                {act.id}
                                            </Text>
                                            <Text style={styles.activityDetail}>
                                                <Text style={styles.detailLabel}>Início: </Text>
                                                {act.starting_date}
                                            </Text>
                                            {act.activity_end && (
                                                <Text style={styles.activityDetail}>
                                                    <Text style={styles.detailLabel}>Fim: </Text>
                                                    {act.activity_end}
                                                </Text>
                                            )}
                                            {act.notes && (
                                                <Text style={styles.activityDetail}>
                                                    <Text style={styles.detailLabel}>Notas: </Text>
                                                    {act.notes}
                                                </Text>
                                            )}
                                            {act.gps_track && (
                                                <Text style={styles.activityDetail}>
                                                    <Text style={styles.detailLabel}>GPS: </Text>
                                                    {act.gps_track}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Informações Importantes:</Text>
                        <Text style={styles.infoText}>• Todos os campos marcados com * são obrigatórios</Text>
                        <Text style={styles.infoText}>• Certifique-se de que os IDs existem no sistema</Text>
                        <Text style={styles.infoText}>• O status retornará informações sobre a operação</Text>
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
    helpText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
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
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    detailsContainer: {
        marginVertical: 12,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
    },
    detailLabel: {
        fontWeight: '600',
        color: '#333',
    },
    activitiesTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
        color: '#333',
    },
    activitiesContainer: {
        marginTop: 8,
    },
    activityItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        marginBottom: 10,
    },
    activityDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
});