import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

export default function StartActivity() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const [operationId, setOperationId] = useState("");
    const [ruralPropertyId, setRuralPropertyId] = useState("");
    const [polygonId, setPolygonId] = useState("");
    const [worksheetId, setWorksheetId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleStartActivity = async () => {
        if (!operationId.trim() || !ruralPropertyId.trim() || !polygonId.trim() || !worksheetId.trim() || !startDate.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios', [
                { text: 'OK' }
            ]);
            return;
        }

        setIsLoading(true);
        try {

            const data = await WorksheetService.startActivity(
                token,
                operationId,
                ruralPropertyId,
                polygonId,
                worksheetId,
                startDate
            );

            console.log("Atividade iniciada com sucesso:", data);
            Alert.alert('Sucesso', 'Atividade iniciada com sucesso!', [
                { text: 'OK', onPress: () => router.back() }
            ]);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message, [
                    { text: 'Entendi' }
                ]);
            } else {
                console.log("Erro inesperado:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado', [
                    { text: 'Entendi' }
                ]);
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
        setStartDate("");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Iniciar Atividade</Text>
                    <Text style={styles.subtitle}>
                        Preencha os dados necessários para iniciar uma nova atividade
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Informações da Atividade</Text>

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

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Data de Início *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY HH:mm"
                            value={startDate}
                            onChangeText={setStartDate}
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        <Text style={styles.helpText}>
                            Formato: Dia/Mês/Ano HH:mm (ex: 19/07/2025 12:24)
                        </Text>
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
                                title={isLoading ? "Iniciando..." : "Iniciar Atividade"}
                                onPress={handleStartActivity}
                                disabled={isLoading}
                                color="#34C759"
                            />
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Informações Importantes:</Text>
                        <Text style={styles.infoText}>• Todos os campos marcados com * são obrigatórios</Text>
                        <Text style={styles.infoText}>• Certifique-se de que os IDs existem no sistema</Text>
                        <Text style={styles.infoText}>• A data deve estar no formato correto</Text>
                        <Text style={styles.infoText}>• Uma vez iniciada, a atividade ficará registrada</Text>
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
});