import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Switch } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

export default function StopActivity() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const [operationId, setOperationId] = useState("");
    const [ruralPropertyId, setRuralPropertyId] = useState("");
    const [polygonId, setPolygonId] = useState("");
    const [worksheetId, setWorksheetId] = useState("");
    const [endDate, setEndDate] = useState("");
    const [finalActivity, setFinalActivity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fillCurrentDateTime = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        setEndDate(formattedDateTime);
    };

    const handleStopActivity = async () => {
        // Validação de campos obrigatórios
        if (!operationId.trim() || !ruralPropertyId.trim() || !polygonId.trim() || !worksheetId.trim() || !endDate.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios', [
                { text: 'OK' }
            ]);
            return;
        }

        // Validação de formato da data
        const dateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
        if (!dateRegex.test(endDate.trim())) {
            Alert.alert('Erro', 'Por favor, insira a data no formato correto: DD/MM/YYYY HH:mm', [
                { text: 'OK' }
            ]);
            return;
        }

        setIsLoading(true);
        try {
            console.log('🔍 Buscando status da operação...');

            // 1) Buscar status global para extrair último ID de atividade
            const statusData = await WorksheetService.viewOperationStatusGlobal(
                token as string,
                parseInt(worksheetId, 10),
                operationId
            );

            console.log('📊 Status data received:', statusData);

            // Verificar se existem assignments
            const assignments = statusData.assignments;
            if (!assignments || assignments.length === 0) {
                throw new Error('Não foi possível encontrar assignments para esta operação');
            }

            // Pegar o último assignment
            const lastAssignment = assignments[assignments.length - 1];
            const activities = lastAssignment.activities;

            if (!activities || activities.length === 0) {
                throw new Error('Não foi possível encontrar activities para esta operação');
            }

            // Pegar a última atividade
            const lastActivity = activities[activities.length - 1];

            // Verificar se a atividade já foi terminada
            const hasEndDate = lastActivity.endDate || lastActivity.end_date ||
                lastActivity.ACTIVITY_END || lastActivity.activityEnd;

            if (hasEndDate) {
                throw new Error('Esta atividade já foi terminada anteriormente.');
            }

            // Extrair activityId preservando precisão - converter para string
            const activityIdString = String(lastActivity.id);
            console.log('🔢 Activity ID extraído:', activityIdString);
            console.log('📝 Tipo do Activity ID:', typeof activityIdString);

            // 2) Terminar a atividade com o ID extraído
            console.log('🛑 Enviando request para terminar atividade...');

            const endActivityData = await WorksheetService.endActivity(
                token as string,
                operationId,
                ruralPropertyId,
                parseInt(polygonId, 10),
                parseInt(worksheetId, 10),
                activityIdString, // Enviar como string para preservar precisão
                endDate,
                finalActivity
            );

            console.log('✅ Atividade terminada com sucesso:', endActivityData);

            Alert.alert('Sucesso', 'Atividade terminada com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => {
                        clearForm();
                        router.back();
                    }
                }
            ]);

        } catch (err: unknown) {
            console.error('❌ Erro ao terminar atividade:', err);

            if (err instanceof Error) {
                // Tratar mensagens de erro específicas do backend
                let errorMessage = err.message;

                if (errorMessage.includes('invalid or expired token')) {
                    errorMessage = 'Token de autenticação inválido ou expirado. Faça login novamente.';
                } else if (errorMessage.includes('permission')) {
                    errorMessage = 'Você não tem permissão para terminar atividades.';
                } else if (errorMessage.includes('employer mismatch')) {
                    errorMessage = 'Você não tem autorização para esta folha de obra.';
                } else if (errorMessage.includes('wasnt assigned')) {
                    errorMessage = 'Esta operação não foi atribuída ao seu usuário.';
                } else if (errorMessage.includes('already ended')) {
                    errorMessage = 'Esta atividade já foi terminada anteriormente.';
                } else if (errorMessage.includes('endDate must come after')) {
                    errorMessage = 'A data de fim deve ser posterior à data de início da atividade.';
                } else if (errorMessage.includes('endDate must respect format')) {
                    errorMessage = 'Formato de data inválido. Use: DD/MM/YYYY HH:mm';
                }

                Alert.alert('Erro', errorMessage, [
                    { text: 'Entendi' }
                ]);
            } else {
                console.log("Erro inesperado:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente.', [
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
        setEndDate("");
        setFinalActivity(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Terminar Atividade</Text>
                    <Text style={styles.subtitle}>
                        Preencha os dados necessários para terminar uma atividade em execução
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Informações da Atividade</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Operação *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: H6, A1, B3"
                            value={operationId}
                            onChangeText={setOperationId}
                            autoCapitalize="characters"
                            editable={!isLoading}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Propriedade Rural *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 141302_B_68"
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
                            placeholder="Ex: 1, 2, 3"
                            value={polygonId}
                            onChangeText={setPolygonId}
                            autoCapitalize="none"
                            editable={!isLoading}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Folha de Obra *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 123, 456"
                            value={worksheetId}
                            onChangeText={setWorksheetId}
                            autoCapitalize="none"
                            editable={!isLoading}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Data e Hora de Fim *</Text>
                        <View style={styles.dateInputContainer}>
                            <TextInput
                                style={[styles.input, styles.dateInput]}
                                placeholder="DD/MM/YYYY HH:mm"
                                value={endDate}
                                onChangeText={setEndDate}
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                            <View style={styles.nowButton}>
                                <Button
                                    title="Agora"
                                    onPress={fillCurrentDateTime}
                                    disabled={isLoading}
                                    color="#007AFF"
                                />
                            </View>
                        </View>
                        <Text style={styles.helpText}>
                            Formato: Dia/Mês/Ano Hora:Minuto (ex: 20/07/2025 14:30)
                        </Text>
                    </View>

                    <View style={styles.switchContainer}>
                        <View style={styles.switchContent}>
                            <Text style={styles.switchLabel}>Atividade final desta operação</Text>
                            <Text style={styles.switchSubtext}>
                                Marque se esta for a última atividade da operação
                            </Text>
                        </View>
                        <Switch
                            value={finalActivity}
                            onValueChange={setFinalActivity}
                            disabled={isLoading}
                            trackColor={{ false: '#ddd', true: '#34C759' }}
                            thumbColor={finalActivity ? '#fff' : '#fff'}
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
                                title={isLoading ? "Terminando..." : "Terminar Atividade"}
                                onPress={handleStopActivity}
                                disabled={isLoading}
                                color="#FF6B35"
                            />
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>❗ Informações Importantes</Text>
                        <Text style={styles.infoText}>• Todos os campos marcados com * são obrigatórios</Text>
                        <Text style={styles.infoText}>• Certifique-se de que os IDs correspondem a uma operação ativa</Text>
                        <Text style={styles.infoText}>• A data de fim deve ser posterior à data de início da atividade</Text>
                        <Text style={styles.infoText}>• Marque "Atividade final" apenas se esta for a última atividade</Text>
                        <Text style={styles.infoText}>• Uma vez terminada, a atividade não pode ser revertida</Text>
                    </View>

                    <View style={styles.warningContainer}>
                        <Text style={styles.warningTitle}>⚠️ Atenção</Text>
                        <Text style={styles.warningText}>
                            Esta ação irá finalizar permanentemente a atividade atual.
                            Verifique se todos os dados estão corretos antes de confirmar.
                        </Text>
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
        lineHeight: 22,
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
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dateInput: {
        flex: 1,
    },
    nowButton: {
        minWidth: 70,
    },
    helpText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    switchContent: {
        flex: 1,
        marginRight: 15,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    switchSubtext: {
        fontSize: 13,
        color: '#666',
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
        backgroundColor: '#e8f4fd',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
        lineHeight: 20,
    },
    warningContainer: {
        backgroundColor: '#fff3cd',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B35',
        borderWidth: 1,
        borderColor: '#ffeaa7',
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#856404',
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});