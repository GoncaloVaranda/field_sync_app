import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {useState} from "react";
import {Alert, Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import WorksheetService from "@/services/SheetsIntegration";


export default function ViewGenericWorksheet(){

    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [worksheetId, setWorksheetId] = useState("");
    const [worksheetData, setWorksheetData] = useState<any>(null);

    const HandleViewGenericWorksheet = async () => {
        try {
            const data = await WorksheetService.viewGeneralWorksheet(
                worksheetId,
                token,
            );

            const mappedData = {
                id: data.worksheet_id ?? data.id,
                aigp: data.aigp ?? '—',
                serviceProviderId: data.service_provider_id ?? '—',
                startingDate: data.starting_date,
                finishingDate: data.finishing_date,
                issueDate: data.issue_date,
                awardDate: data.award_date,
                posaDescription: data.posa_description ?? '—',
                pospDescription: data.posp_description ?? '—',
                status: data.status ?? '—'
            };

            console.log("Folha de obra mostrada de forma genérica.", data);
            setWorksheetData(mappedData);
            Alert.alert('Success', 'Account state successfully showed!', [
                { text: 'OK' },
            ]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Error', err.message, [
                    {text: 'I understand'},
                ]);
            } else {
                console.log("Unexpected error:", err);
            }
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'IMPORTED':
                return styles.statusImported;
            case 'CREATED':
                return styles.statusCreated;
            case 'PENDING':
                return styles.statusPending;
            case 'UNASSIGNED':
                return styles.statusUnassigned;
            case 'ASSIGNED':
                return styles.statusAssigned;
            case 'IN_PROGRESS':
                return styles.statusInProgress;
            case 'COMPLETED':
                return styles.statusCompleted;
            case 'SCHEDULED':
                return styles.statusScheduled;
            default:
                return styles.statusUnassigned;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-PT');
        } catch {
            return '—';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <BackButton style={styles.backButton}/>
                    <View style={styles.header}>
                        <Text style={styles.title}>Detalhes da Folha de Obra</Text>
                        <Text style={styles.subtitle}>Visualização genérica</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.card}>
                    <TextInput
                        style={styles.input}
                        placeholder="ID da Folha de Obra"
                        placeholderTextColor="#999"
                        value={worksheetId}
                        onChangeText={setWorksheetId}
                        keyboardType="numeric"
                    />
                    <Button
                        title="Pesquisar"
                        onPress={HandleViewGenericWorksheet}
                        color="#3b82f6"
                    />

                    {worksheetData && (
                        <View style={styles.resultsContainer}>
                            <Text style={styles.sectionTitle}>Folha de Obra #{worksheetData.id}</Text>

                            <View style={styles.grid}>
                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Estado</Text>
                                    <Text style={[styles.value, getStatusStyle(worksheetData.status)]}>
                                        {worksheetData.status}
                                    </Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>AIGP</Text>
                                    <Text style={styles.value}>{worksheetData.aigp}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Fornecedor</Text>
                                    <Text style={styles.value}>{worksheetData.serviceProviderId}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Início</Text>
                                    <Text style={styles.value}>{formatDate(worksheetData.startingDate)}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Término</Text>
                                    <Text style={styles.value}>{formatDate(worksheetData.finishingDate)}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Emissão</Text>
                                    <Text style={styles.value}>{formatDate(worksheetData.issueDate)}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Receção</Text>
                                    <Text style={styles.value}>{formatDate(worksheetData.awardDate)}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Descrição POSA</Text>
                                    <Text style={styles.value}>{worksheetData.posaDescription}</Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.label}>Descrição POSP</Text>
                                    <Text style={styles.value}>{worksheetData.pospDescription}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 40,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    headerContainer: {
        marginBottom: 30,
        position: 'relative',
    },
    backButton: {
        position: 'relative', // Mudei de absolute para relative
        top: 0,
        left: 0,
        marginBottom: 20, // Adicionei margem inferior
    },
    header: {
        marginTop: 10, // Adicionei margem superior
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    resultsContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    label: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    status: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        textTransform: 'uppercase',
        overflow: 'hidden',
    },
    statusImported: {
        backgroundColor: '#E0F2FE',
        color: '#0369A1',
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    statusCreated: {
        backgroundColor: '#DCFCE7',
        color: '#166534',
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    statusPending: {
        backgroundColor: '#FEF9C3',
        color: '#854D0E',
        borderWidth: 1,
        borderColor: '#FEF08A',
    },
    statusUnassigned: {
        backgroundColor: '#F3F4F6',
        color: '#4B5563',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statusAssigned: {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    statusInProgress: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    statusCompleted: {
        backgroundColor: '#D1FAE5',
        color: '#065F46',
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    statusScheduled: {
        backgroundColor: '#EDE9FE',
        color: '#5B21B6',
        borderWidth: 1,
        borderColor: '#DDD6FE',
    },
    statusDefault: {
        color: '#475569',
        backgroundColor: '#e2e8f0',
    },
});