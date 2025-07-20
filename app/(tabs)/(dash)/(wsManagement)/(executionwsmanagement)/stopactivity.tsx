import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Switch } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

interface DebugInfo {
    assignmentCount: number;
    activityCount: number;
    extractedActivityId: string;
    lastActivity: any;
}

export default function StopActivity() {
    const [operationId, setOperationId] = useState('');
    const [ruralPropertyId, setRuralPropertyId] = useState('');
    const [polygonId, setPolygonId] = useState('');
    const [worksheetId, setWorksheetId] = useState('');
    const [endDate, setEndDate] = useState('');
    const [finalActivity, setFinalActivity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

    const router = useRouter();
    const params = useLocalSearchParams();

    // Função melhorada para verificar se uma atividade realmente foi terminada
    const isActivityAlreadyEnded = (activity: any): boolean => {
        console.log('Verificando se atividade já foi terminada...');
        console.log('Dados da atividade:', JSON.stringify(activity, null, 2));

        // Lista de possíveis campos que indicam data de fim
        const endDateFields = [
            'endDate',
            'end_date',
            'ACTIVITY_END',
            'activityEnd',
            'dateEnd',
            'finished_at',
            'completed_at'
        ];

        // Log dos valores dos campos para debugging
        console.log('Verificando campos de data de fim:');
        endDateFields.forEach(field => {
            console.log(`${field}:`, activity[field]);
        });

        for (const field of endDateFields) {
            const value = activity[field];

            // Verificar se o valor realmente indica uma data válida
            if (value) {
                // Se for string, verificar se não está vazia e não é apenas espaços
                if (typeof value === 'string') {
                    const trimmedValue = value.trim();
                    if (trimmedValue &&
                        trimmedValue !== '' &&
                        trimmedValue !== '0000-00-00' &&
                        trimmedValue !== '0000-00-00 00:00:00' &&
                        trimmedValue !== 'null' &&
                        trimmedValue !== 'undefined') {

                        // Tentar parsear como data para validar
                        const date = new Date(trimmedValue);
                        if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
                            console.log(`Atividade já terminada. Campo: ${field}, Valor: ${trimmedValue}`);
                            return true;
                        }
                    }
                }
                // Se for número e maior que 0 (timestamp)
                else if (typeof value === 'number' && value > 0) {
                    console.log(`Atividade já terminada. Campo: ${field}, Valor: ${value}`);
                    return true;
                }
                // Se for objeto Date válido
                else if (value instanceof Date && !isNaN(value.getTime())) {
                    console.log(`Atividade já terminada. Campo: ${field}, Valor: ${value}`);
                    return true;
                }
            }
        }

        console.log('Atividade não foi terminada anteriormente');
        return false;
    };

    // Função para extrair o activityId preservando a precisão usando regex
    const extractActivityIdFromResponse = (responseText: string): string => {
        try {
            // Parse JSON normalmente para estrutura
            const parsed = JSON.parse(responseText);
            const assignments = parsed.assignments;

            if (!assignments || assignments.length === 0) {
                throw new Error('Não foi possível encontrar assignments');
            }

            const lastAssignment = assignments[assignments.length - 1];
            const activities = lastAssignment.activities;

            if (!activities || activities.length === 0) {
                throw new Error('Não foi possível encontrar activities');
            }

            // CORREÇÃO CRÍTICA: Usar regex para extrair o ID como string
            // Procurar pelo último "id" no JSON para pegar a última atividade
            const idMatches = responseText.match(/"id"\s*:\s*(\d+)/g);

            if (!idMatches || idMatches.length === 0) {
                throw new Error('Não foi possível encontrar o ID da atividade no response');
            }

            // Pegar o último match (que corresponde à última atividade)
            const lastIdMatch = idMatches[idMatches.length - 1];
            const activityIdMatch = lastIdMatch.match(/(\d+)/);

            if (!activityIdMatch || !activityIdMatch[1]) {
                throw new Error('Erro ao extrair o número do ID');
            }

            // Retornar como string para preservar a precisão total
            const activityIdString = activityIdMatch[1];
            console.log('Activity ID extraído como string:', activityIdString);

            return activityIdString;

        } catch (error) {
            console.error('Erro ao extrair activity ID:', error);
            throw new Error('Erro ao processar resposta do servidor: ' + (error as Error).message);
        }
    };

    // Função para preencher automaticamente a data/hora atual
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

    // Função para limpar o formulário
    const clearForm = () => {
        setOperationId('');
        setRuralPropertyId('');
        setPolygonId('');
        setWorksheetId('');
        setEndDate('');
        setFinalActivity(false);
        setDebugInfo(null);
    };

    const handleStopActivity = async () => {
        // Validação dos campos obrigatórios
        if (!operationId || !ruralPropertyId || !polygonId || !worksheetId || !endDate) {
            Alert.alert('Erro', 'Todos os campos marcados com * são obrigatórios');
            return;
        }

        // Obter token do usuário atual (assumindo que está disponível globalmente ou via params)
        const currentUserToken = params.token as string || ''; // Ajuste conforme sua implementação de autenticação

        if (!currentUserToken) {
            Alert.alert('Erro', 'Token de autenticação não encontrado');
            router.push('/login');
            return;
        }

        setIsLoading(true);
        setDebugInfo(null);

        try {
            console.log('Buscando status da operação...');

            const statusResponse = await WorksheetService.viewOperationStatusGlobal(
                currentUserToken,
                parseInt(worksheetId, 10),
                operationId
            );

            const statusResponseText = JSON.stringify(statusResponse);
            console.log('Resposta do status (texto bruto):', statusResponseText);

            // Extrair activity ID preservando precisão
            const activityIdString = extractActivityIdFromResponse(statusResponseText);
            console.log('Activity ID extraído:', activityIdString);

            // Parse da resposta para verificações adicionais
            const statusData = JSON.parse(statusResponseText);
            const assignments = statusData.assignments;

            const lastAssignment = assignments[assignments.length - 1];
            const activities = lastAssignment.activities;
            const lastActivity = activities[activities.length - 1];

            console.log('Dados da última atividade:', JSON.stringify(lastActivity, null, 2));

            // CORREÇÃO: Usar a função melhorada para verificar se já foi terminada
            if (isActivityAlreadyEnded(lastActivity)) {
                throw new Error('Esta atividade já foi terminada anteriormente.');
            }

            // Informações de debug
            setDebugInfo({
                assignmentCount: assignments.length,
                activityCount: activities.length,
                extractedActivityId: activityIdString,
                lastActivity: lastActivity
            });

            // 2) Chamar a função endActivity
            console.log('Enviando request para end-activity...');
            console.log('activityId (string):', activityIdString);
            console.log('Tipo do activityId:', typeof activityIdString);

            const result = await WorksheetService.endActivity(
                currentUserToken,
                operationId,
                ruralPropertyId,
                parseInt(polygonId, 10),
                parseInt(worksheetId, 10),
                activityIdString, // Manter como string para preservar precisão
                endDate,
                finalActivity
            );

            Alert.alert(
                'Sucesso',
                'Atividade terminada com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            clearForm();
                            // Navegar de volta após sucesso
                            setTimeout(() => router.back(), 1000);
                        }
                    }
                ]
            );

        } catch (err) {
            console.error('Erro completo:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';

            Alert.alert('Erro', errorMessage);
        } finally {
            setIsLoading(false);
        }
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
                        <Text style={styles.infoText}>• Marque `Atividade final` apenas se esta for a última atividade</Text>
                        <Text style={styles.infoText}>• Uma vez terminada, a atividade não pode ser revertida</Text>
                    </View>

                    <View style={styles.warningContainer}>
                        <Text style={styles.warningTitle}>⚠️ Atenção</Text>
                        <Text style={styles.warningText}>
                            Esta ação irá finalizar permanentemente a atividade atual.
                            Verifique se todos os dados estão corretos antes de confirmar.
                        </Text>
                    </View>

                    {debugInfo && (
                        <View style={styles.debugContainer}>
                            <Text style={styles.debugTitle}>Informações de Debug:</Text>
                            <Text style={styles.debugText}>
                                <Text style={styles.debugLabel}>Assignments encontrados:</Text> {debugInfo.assignmentCount}
                            </Text>
                            <Text style={styles.debugText}>
                                <Text style={styles.debugLabel}>Atividades encontradas:</Text> {debugInfo.activityCount}
                            </Text>
                            <Text style={styles.debugText}>
                                <Text style={styles.debugLabel}>Activity ID extraído:</Text> {debugInfo.extractedActivityId}
                            </Text>
                            <Text style={styles.debugText}>
                                <Text style={styles.debugLabel}>Última atividade:</Text> {JSON.stringify(debugInfo.lastActivity, null, 2)}
                            </Text>
                        </View>
                    )}
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
        marginBottom: 20,
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
    debugContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dee2e6',
        marginTop: 20,
    },
    debugTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#495057',
    },
    debugText: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 4,
        lineHeight: 18,
    },
    debugLabel: {
        fontWeight: '600',
    },
});
