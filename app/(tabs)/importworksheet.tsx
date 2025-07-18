import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ImportWorksheet() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();
    
    const [worksheetName, setWorksheetName] = useState("");
    const [geoJsonData, setGeoJsonData] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImportWorksheet = async () => {
        if (!geoJsonData.trim()) {
            Alert.alert('Error', 'Por favor, insira os dados GeoJSON', [
                { text: 'OK' }
            ]);
            return;
        }

        setIsLoading(true);
        try {
            // Parse the GeoJSON to validate it
            let parsedGeoJson;
            try {
                parsedGeoJson = JSON.parse(geoJsonData);
            } catch (parseError) {
                throw new Error('Formato GeoJSON inválido. Verifique a sintaxe JSON.');
            }

            // Validate basic GeoJSON structure
            if (!parsedGeoJson.type || !parsedGeoJson.features || !parsedGeoJson.metadata) {
                throw new Error('GeoJSON deve conter "type", "features" e "metadata".');
            }

            // Prepare the worksheet data for the API
            const worksheetData = {
                name: worksheetName || "",
                ...parsedGeoJson
            };

            const data = await AuthService.importWorksheet(token, worksheetData);

            console.log("Folha de obra importada com sucesso:", data);
            Alert.alert('Sucesso', 'Folha de obra importada com sucesso!', [
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

    const validateGeoJson = () => {
        if (!geoJsonData.trim()) {
            Alert.alert('Aviso', 'Por favor, insira os dados GeoJSON primeiro', [
                { text: 'OK' }
            ]);
            return;
        }

        try {
            const parsed = JSON.parse(geoJsonData);
            
            // Basic validation
            const errors = [];
            if (!parsed.type) errors.push("- Campo 'type' em falta");
            if (!parsed.features) errors.push("- Campo 'features' em falta");
            if (!parsed.metadata) errors.push("- Campo 'metadata' em falta");
            if (parsed.metadata && parsed.metadata.operations && parsed.metadata.operations.length > 5) {
                errors.push("- Máximo de 5 operações permitidas");
            }

            if (errors.length > 0) {
                Alert.alert('Validação GeoJSON', 'Problemas encontrados:\n' + errors.join('\n'), [
                    { text: 'OK' }
                ]);
            } else {
                Alert.alert('Validação GeoJSON', 'GeoJSON válido! ✓', [
                    { text: 'OK' }
                ]);
            }
        } catch (error) {
            Alert.alert('Erro de Validação', 'Formato JSON inválido. Verifique a sintaxe.', [
                { text: 'OK' }
            ]);
        }
    };

    const clearForm = () => {
        setWorksheetName("");
        setGeoJsonData("");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton />
                
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Importar Folha de Obra</Text>
                    <Text style={styles.subtitle}>
                        Importe uma nova folha de obra através de dados GeoJSON
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Informações da Folha</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da folha de obra (opcional)"
                        placeholderTextColor="#999"
                        value={worksheetName}
                        onChangeText={setWorksheetName}
                        autoCapitalize="words"
                    />

                    <Text style={styles.sectionTitle}>Dados GeoJSON</Text>
                    <Text style={styles.helpText}>
                        Cole aqui os dados GeoJSON contendo metadata, features e operações
                    </Text>
                    
                    <TextInput
                        style={styles.geoJsonInput}
                        placeholder='{"type": "FeatureCollection", "metadata": {...}, "features": [...], "crs": {...}}'
                        placeholderTextColor="#999"
                        value={geoJsonData}
                        onChangeText={setGeoJsonData}
                        multiline
                        textAlignVertical="top"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <View style={styles.buttonRow}>
                        <View style={styles.halfButton}>
                            <Button
                                title="Validar JSON"
                                onPress={validateGeoJson}
                                color="#007AFF"
                            />
                        </View>
                        <View style={styles.halfButton}>
                            <Button
                                title="Limpar"
                                onPress={clearForm}
                                color="#FF3B30"
                            />
                        </View>
                    </View>

                    <View style={styles.importButtonContainer}>
                        <Button
                            title={isLoading ? "Importando..." : "Importar Folha de Obra"}
                            onPress={handleImportWorksheet}
                            disabled={isLoading || !geoJsonData.trim()}
                            color="#34C759"
                        />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>Requisitos do GeoJSON:</Text>
                        <Text style={styles.infoText}>• Deve conter "type", "metadata", "features" e "crs"</Text>
                        <Text style={styles.infoText}>• Máximo de 5 operações por folha</Text>
                        <Text style={styles.infoText}>• Metadata deve incluir ID único da folha</Text>
                        <Text style={styles.infoText}>• Features representam as parcelas/polígonos</Text>
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
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    geoJsonInput: {
        minHeight: 200,
        maxHeight: 300,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 14,
        backgroundColor: '#fff',
        fontFamily: 'monospace',
    },
    helpText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontStyle: 'italic',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 10,
    },
    halfButton: {
        flex: 1,
    },
    importButtonContainer: {
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