import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Alert, KeyboardAvoidingView, Platform,} from 'react-native';
import WorksheetService from "@/services/SheetsIntegration";
import BackButton from "@/app/utils/back_button";
import {useLocalSearchParams} from "expo-router";


interface Assignment {
    operationCode: string;
    ruralPropertyId: string;
    polygonId: string;
    operatorUsername: string;
}

interface Message {
    type: 'success' | 'error';
    text: string;
}

const AssignOperations: React.FC = () => {
    const [worksheetId, setWorksheetId] = useState<string>('');
    const [assignments, setAssignments] = useState<Assignment[]>([
        {
            operationCode: '',
            ruralPropertyId: '',
            polygonId: '',
            operatorUsername: '',
        },
    ]);
    const [message, setMessage] = useState<Message | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { token, username, role } = useLocalSearchParams();

    const handleChange = (index: number, field: keyof Assignment, value: string) => {
        const updatedAssignments = [...assignments];
        updatedAssignments[index][field] = value;
        setAssignments(updatedAssignments);

        // Clear message when user starts typing
        if (message) {
            setMessage(null);
        }
    };

    const handleAdd = () => {
        setAssignments([
            ...assignments,
            {
                operationCode: '',
                ruralPropertyId: '',
                polygonId: '',
                operatorUsername: '',
            },
        ]);
    };

    const handleRemove = (index: number) => {
        if (assignments.length > 1) {
            const updatedAssignments = assignments.filter((_, i) => i !== index);
            setAssignments(updatedAssignments);
        }
    };

    const validateForm = (): string | null => {
        if (!worksheetId.trim()) {
            return 'O ID da folha é obrigatório';
        }

        for (let i = 0; i < assignments.length; i++) {
            const assignment = assignments[i];

            if (!assignment.operationCode.trim()) {
                return `Código da Operação é obrigatório na atribuição ${i + 1}`;
            }

            if (!assignment.ruralPropertyId.trim()) {
                return `ID da Propriedade Rural é obrigatório na atribuição ${i + 1}`;
            }

            if (!assignment.operatorUsername.trim()) {
                return `Username do Operador é obrigatório na atribuição ${i + 1}`;
            }
        }

        return null;
    };

    const showConfirmDialog = () => {
        const validationError = validateForm();
        if (validationError) {
            setMessage({
                type: 'error',
                text: validationError,
            });
            return;
        }

        Alert.alert(
            'Confirmar Atribuições',
            `Deseja confirmar as atribuições para a folha ${worksheetId}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    style: 'default',
                    onPress: handleSubmit,
                },
            ]
        );
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setMessage(null);

        try {

            const assignOperationsData = {
                id: parseInt(worksheetId),
                assignments: assignments.map(assignment => ({
                    operationCode: assignment.operationCode.trim(),
                    ruralPropertyId: assignment.ruralPropertyId.trim(),
                    polygonId: assignment.polygonId.trim() ? parseInt(assignment.polygonId) : 0,
                    operatorUsername: assignment.operatorUsername.trim(),
                })),
            };

            const response = await WorksheetService.assignOperations(token, assignOperationsData);

            setMessage({
                type: 'success',
                text: `Atribuições realizadas com sucesso! ${assignments.length} operação(ões) atribuída(s).`,
            });

            setWorksheetId('');
            setAssignments([
                {
                    operationCode: '',
                    ruralPropertyId: '',
                    polygonId: '',
                    operatorUsername: '',
                },
            ]);

        } catch (error) {
            console.error('Erro ao atribuir operações:', error);
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Erro desconhecido ao atribuir operações',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <BackButton />

                    <View style={styles.mainContent}>
                        <Text style={styles.title}>Atribuir Operações</Text>
                        <Text style={styles.subtitle}>
                            Preencha o ID da folha e detalhe cada atribuição
                        </Text>

                        <View style={styles.formContainer}>
                            <Text style={styles.sectionTitle}>ID da Folha</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    !worksheetId.trim() && message?.type === 'error'
                                        ? styles.inputError
                                        : null
                                ]}
                                keyboardType="numeric"
                                value={worksheetId}
                                onChangeText={setWorksheetId}
                                placeholder="Digite o ID da folha"
                                placeholderTextColor="#999"
                                editable={!isSubmitting}
                                returnKeyType="next"
                            />

                            <Text style={styles.sectionTitle}>Atribuições</Text>
                            {assignments.map((assignment, index) => (
                                <View key={index} style={styles.assignmentContainer}>
                                    <Text style={styles.assignmentTitle}>
                                        Atribuição {index + 1}
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        value={assignment.operationCode}
                                        onChangeText={(text) => handleChange(index, 'operationCode', text)}
                                        placeholder="Código da Operação *"
                                        placeholderTextColor="#999"
                                        editable={!isSubmitting}
                                        returnKeyType="next"
                                    />

                                    <TextInput
                                        style={styles.input}
                                        value={assignment.ruralPropertyId}
                                        onChangeText={(text) => handleChange(index, 'ruralPropertyId', text)}
                                        placeholder="ID da Propriedade Rural *"
                                        placeholderTextColor="#999"
                                        editable={!isSubmitting}
                                        returnKeyType="next"
                                    />

                                    <TextInput
                                        style={styles.input}
                                        value={assignment.polygonId}
                                        onChangeText={(text) => handleChange(index, 'polygonId', text)}
                                        placeholder="ID do Polígono (opcional)"
                                        keyboardType="numeric"
                                        placeholderTextColor="#999"
                                        editable={!isSubmitting}
                                        returnKeyType="next"
                                    />

                                    <TextInput
                                        style={styles.input}
                                        value={assignment.operatorUsername}
                                        onChangeText={(text) => handleChange(index, 'operatorUsername', text)}
                                        placeholder="Username do Operador *"
                                        placeholderTextColor="#999"
                                        editable={!isSubmitting}
                                        returnKeyType={index === assignments.length - 1 ? "done" : "next"}
                                    />

                                    {assignments.length > 1 && (
                                        <TouchableOpacity
                                            onPress={() => handleRemove(index)}
                                            disabled={isSubmitting}
                                            style={[styles.button, styles.removeButton]}
                                        >
                                            <Text style={styles.removeButtonText}>
                                                Remover Atribuição
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}

                            <TouchableOpacity
                                onPress={handleAdd}
                                style={[styles.button, styles.addButton]}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.addButtonText}>+ Adicionar Operação</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={showConfirmDialog}
                                style={[
                                    styles.button,
                                    styles.submitButton,
                                    isSubmitting && styles.disabledButton
                                ]}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isSubmitting ? 'Atribuindo...' : 'Confirmar Atribuições'}
                                </Text>
                            </TouchableOpacity>

                            {message && (
                                <View style={[
                                    styles.messageContainer,
                                    message.type === 'success'
                                        ? styles.successMessage
                                        : styles.errorMessage
                                ]}>
                                    <Text style={[
                                        styles.messageTitle,
                                        message.type === 'success'
                                            ? styles.successTitle
                                            : styles.errorTitle
                                    ]}>
                                        {message.type === 'success' ? '✓ Sucesso' : '✗ Erro'}
                                    </Text>
                                    <Text style={styles.messageText}>{message.text}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    backButton: {
        marginTop: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    mainContent: {
        marginTop: 20,
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
        marginBottom: 30,
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
    assignmentContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    assignmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495057',
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#FF3B30',
        borderWidth: 2,
    },
    button: {
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: '#28a745',
        borderWidth: 1,
        borderColor: '#28a745',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        marginTop: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    disabledButton: {
        backgroundColor: '#6c757d',
        opacity: 0.7,
    },
    messageContainer: {
        padding: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        marginTop: 10,
    },
    successMessage: {
        backgroundColor: '#d4edda',
        borderLeftColor: '#28a745',
        borderColor: '#c3e6cb',
        borderWidth: 1,
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        borderLeftColor: '#dc3545',
        borderColor: '#f5c6cb',
        borderWidth: 1,
    },
    messageTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    successTitle: {
        color: '#155724',
    },
    errorTitle: {
        color: '#721c24',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#495057',
    },
});

export default AssignOperations;