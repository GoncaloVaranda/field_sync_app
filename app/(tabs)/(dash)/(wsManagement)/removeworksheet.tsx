import BackButton from "@/app/utils/back_button";
import WorksheetService from "@/services/SheetsIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function RemoveWorksheet() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();
    const [worksheetId, setWorksheetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const confirmRemoval = () => {
        Alert.alert(
            'Confirmar Remoção',
            `Tem a certeza que deseja remover a folha de obra com ID ${worksheetId}?\n\nEsta ação é irreversível e irá remover todos os dados associados.`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => handleRemoveWorksheet(),
                },
            ],
        );
    };

    const handleRemoveWorksheet = async () => {
        setIsLoading(true);
        try {
            const data = await WorksheetService.removeWorksheet(token, worksheetId);

            console.log("Folha de obra removida com sucesso:", data);
            Alert.alert('Sucesso', 'Folha de obra removida com sucesso!', [
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />
                
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Remover Folha de Obra</Text>
                    <Text style={styles.subtitle}>
                        Remova uma folha de obra existente do sistema
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Identificação da Folha</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="ID da folha de obra"
                        placeholderTextColor="#999"
                        value={worksheetId}
                        onChangeText={setWorksheetId}
                        keyboardType="numeric"
                        autoCapitalize="none"
                    />

                    <View style={styles.warningContainer}>
                        <Text style={styles.warningTitle}>⚠️ Aviso Importante</Text>
                        <Text style={styles.warningText}>
                            A remoção de uma folha de obra é uma ação irreversível que irá eliminar:
                        </Text>
                        <Text style={styles.warningListItem}>• A folha de obra principal</Text>
                        <Text style={styles.warningListItem}>• Todas as operações associadas</Text>
                        <Text style={styles.warningListItem}>• Todas as parcelas (features)</Text>
                        <Text style={styles.warningListItem}>• Folhas de execução relacionadas</Text>
                        <Text style={styles.warningListItem}>• Atribuições e calendário</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={isLoading ? "Removendo..." : "Remover Folha de Obra"}
                            onPress={confirmRemoval}
                            disabled={isLoading || !worksheetId.trim() || isNaN(parseInt(worksheetId))}
                            color="#FF3B30"
                        />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Requisitos:</Text>
                        <Text style={styles.infoText}>• ID numérico válido da folha de obra</Text>
                        <Text style={styles.infoText}>• Permissões adequadas para remoção</Text>
                        <Text style={styles.infoText}>• A folha deve existir no sistema</Text>
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
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    warningContainer: {
        backgroundColor: '#fff3cd',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#856404',
        marginBottom: 8,
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        marginBottom: 8,
        lineHeight: 20,
    },
    warningListItem: {
        fontSize: 14,
        color: '#856404',
        marginBottom: 4,
        marginLeft: 8,
        lineHeight: 18,
    },
    buttonContainer: {
        marginBottom: 30,
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