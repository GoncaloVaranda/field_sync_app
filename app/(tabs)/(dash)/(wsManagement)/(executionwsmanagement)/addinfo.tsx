import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

export default function AddInfo() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const [operationId, setOperationId] = useState("");
    const [ruralPropertyId, setRuralPropertyId] = useState("");
    const [polygonId, setPolygonId] = useState("");
    const [worksheetId, setWorksheetId] = useState("");
    const [activityId, setActivityId] = useState("");
    const [notes, setNotes] = useState("");
    const [gpsTrack, setGpsTrack] = useState("");
    const [photosText, setPhotosText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Função para validar se o activityId é um número válido
    const validateActivityId = (activityId: string): string => {
        const trimmedId = activityId.trim();
        if (!trimmedId) {
            throw new Error('Activity ID é obrigatório');
        }

        // Verificar se é um número válido (apenas dígitos)
        if (!/^\d+$/.test(trimmedId)) {
            throw new Error('Activity ID deve conter apenas números');
        }

        // Verificação adicional de precisão
        console.log('Activity ID original:', activityId);
        console.log('Activity ID trimmed:', trimmedId);
        console.log('Activity ID length:', trimmedId.length);

        // Verificar se não há perda de precisão ao converter para number e voltar
        const asNumber = Number(trimmedId);
        const backToString = String(asNumber);

        if (backToString !== trimmedId) {
            console.warn('ALERTA: Possível perda de precisão detectada!');
            console.warn('Original:', trimmedId);
            console.warn('Após conversão:', backToString);
        }

        return trimmedId;
    };

    const handleAddInfo = async () => {
        // Validação de campos obrigatórios
        if (!operationId.trim() || !ruralPropertyId.trim() || !polygonId.trim() || !worksheetId.trim() || !activityId.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios', [
                { text: 'OK' }
            ]);
            return;
        }

        setIsLoading(true);
        try {
            console.log('📝 Adicionando informação à atividade...');

            // Validar e preservar precisão do activityId
            const validatedActivityId = validateActivityId(activityId);

            // Transformar as linhas de photosText em array
            const photos = photosText
                .split('\n')
                .map(url => url.trim())
                .filter(url => url);

            console.log('Dados validados:');
            console.log('- Activity ID:', validatedActivityId);
            console.log('- Tipo do Activity ID:', typeof validatedActivityId);
            console.log('- Photos array:', photos);

            const addInfoData = await WorksheetService.addActivityInfo(
                token as string,
                operationId,
                ruralPropertyId,
                parseInt(polygonId, 10),
                parseInt(worksheetId, 10),
                validatedActivityId, // Enviar como string para preservar precisão
                notes,
                gpsTrack,
                photos
            );

            console.log('✅ Informação adicionada com sucesso:', addInfoData);

            Alert.alert('Sucesso', 'Informação adicionada à atividade com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => {
                        clearForm();
                        router.back();
                    }
                }
            ]);

        } catch (err: unknown) {
            console.error('❌ Erro ao adicionar informação:', err);

            if (err instanceof Error) {
                // Tratar mensagens de erro específicas do backend
                let errorMessage = err.message;

                if (errorMessage.includes('invalid or expired token')) {
                    errorMessage = 'Token de autenticação inválido ou expirado. Faça login novamente.';
                } else if (errorMessage.includes('permission')) {
                    errorMessage = 'Você não tem permissão para adicionar informações a atividades.';
                } else if (errorMessage.includes('employer mismatch')) {
                    errorMessage = 'Você não tem autorização para esta folha de obra.';
                } else if (errorMessage.includes('wasnt assigned')) {
                    errorMessage = 'Esta operação não foi atribuída ao seu usuário.';
                } else if (errorMessage.includes('not found')) {
                    errorMessage = 'Atividade não encontrada. Verifique se o Activity ID está correto.';
                } else if (errorMessage.includes('hasnt ended')) {
                    errorMessage = 'Não é possível adicionar informações a uma atividade que ainda não terminou.';
                } else if (errorMessage.includes('Activity ID deve conter apenas números')) {
                    errorMessage = 'O Activity ID deve conter apenas números.';
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
        setActivityId("");
        setNotes("");
        setGpsTrack("");
        setPhotosText("");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />

                <View style={styles.mainContent}>
                    <Text style={styles.title}>Adicionar Informação</Text>
                    <Text style={styles.subtitle}>
                        Adicione observações, GPS e fotos a uma atividade terminada
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Identificação da Atividade</Text>

                    <View style={styles.row}>
                        <View style={styles.halfInputContainer}>
                            <Text style={styles.inputLabel}>ID da Folha *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 123"
                                value={worksheetId}
                                onChangeText={setWorksheetId}
                                autoCapitalize="none"
                                editable={!isLoading}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.halfInputContainer}>
                            <Text style={styles.inputLabel}>Código da Operação *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: H6"
                                value={operationId}
                                onChangeText={setOperationId}
                                autoCapitalize="characters"
                                editable={!isLoading}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfInputContainer}>
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

                        <View style={styles.halfInputContainer}>
                            <Text style={styles.inputLabel}>ID do Polígono *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 1"
                                value={polygonId}
                                onChangeText={setPolygonId}
                                autoCapitalize="none"
                                editable={!isLoading}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>ID da Atividade *</Text>
                        <TextInput
                            style={[styles.input, styles.activityIdInput]}
                            placeholder="Ex: 1648618595773862125"
                            value={activityId}
                            onChangeText={setActivityId}
                            autoCapitalize="none"
                            editable={!isLoading}
                            keyboardType="numeric"
                            maxLength={25}
                        />
                        <Text style={styles.helpText}>
                            Copie e cole o ID completo da atividade para garantir precisão
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Informações Adicionais</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Observações</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Escreva aqui as suas observações..."
                            value={notes}
                            onChangeText={setNotes}
                            editable={!isLoading}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                        <Text style={styles.helpText}>
                            Observações serão adicionadas às existentes (se houver)
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Track GPS</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Insira o track GPS..."
                            value={gpsTrack}
                            onChangeText={setGpsTrack}
                            editable={!isLoading}
                            multiline={true}
                            numberOfLines={2}
                            textAlignVertical="top"
                        />
                        <Text style={styles.helpText}>
                            String com dados do track GPS
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Fotografias</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="http://exemplo.com/foto1.jpg&#10;http://exemplo.com/foto2.jpg"
                            value={photosText}
                            onChangeText={setPhotosText}
                            editable={!isLoading}
                            multiline={true}
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                        <Text style={styles.helpText}>
                            Uma URL por linha. As fotos serão adicionadas às existentes
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
                                title={isLoading ? "Adicionando..." : "Adicionar Informação"}
                                onPress={handleAddInfo}
                                disabled={isLoading}
                                color="#34C759"
                            />
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>💡 Dica para IDs grandes</Text>
                        <Text style={styles.infoText}>
                            Para IDs de atividade muito grandes (ex: 1648618595773862125),
                            copie e cole o número completo para garantir precisão total.
                        </Text>
                        <Text style={styles.infoText}>
                            <Text style={styles.boldText}>⚠️ Importante:</Text> O ID será enviado como string para preservar todos os dígitos.
                        </Text>
                    </View>

                    <View style={styles.requirementsContainer}>
                        <Text style={styles.requirementsTitle}>📋 Requisitos</Text>
                        <Text style={styles.requirementText}>• Todos os campos marcados com * são obrigatórios</Text>
                        <Text style={styles.requirementText}>• A atividade deve estar terminada para adicionar informações</Text>
                        <Text style={styles.requirementText}>• URLs de fotos devem ser válidas e acessíveis</Text>
                        <Text style={styles.requirementText}>• As informações serão anexadas às existentes</Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    halfInputContainer: {
        flex: 1,
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
    activityIdInput: {
        fontFamily: 'monospace',
        fontSize: 14,
    },
    textArea: {
        height: 80,
        paddingTop: 15,
        paddingBottom: 15,
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
        backgroundColor: '#e7f3ff',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#0066cc',
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#004499',
    },
    infoText: {
        fontSize: 14,
        color: '#0066cc',
        marginBottom: 4,
        lineHeight: 20,
    },
    boldText: {
        fontWeight: '600',
    },
    requirementsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#6c757d',
    },
    requirementsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#495057',
    },
    requirementText: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 4,
        lineHeight: 20,
    },
});