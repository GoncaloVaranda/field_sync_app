import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {JSX, useState} from "react";
import {Alert, Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, FlatList} from "react-native";
import WorksheetService from "@/services/SheetsIntegration";

interface WorksheetMetadata {
    id: number;
    aigp: string;
    starting_date: string;
    finishing_date: string;
    issue_date: string;
    service_provider_id: number;
    award_date: string;
    issuing_user_id: number;
    posa_code: string;
    posa_description: string;
    posp_code: string;
    posp_description: string;
    crs_type: string;
    crs_name: string;
    status: string;
}

interface WorksheetFeature {
    rural_property_id: string;
    polygon_id: number;
    UI_id: number;
    aigp: string;
    coordinates: number[][][] | null;
}

interface WorksheetOperation {
    operation_code: string;
    operation_description: string;
    area_ha: number;
    status: string;
}

interface DetailedWorksheetData {
    metadata: WorksheetMetadata;
    features: WorksheetFeature[];
    operations: WorksheetOperation[];
}

export default function ViewDetailedWorksheet(): JSX.Element {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [worksheetId, setWorksheetId] = useState<string>("");
    const [worksheetData, setWorksheetData] = useState<DetailedWorksheetData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const HandleViewDetailedWorksheet = async (): Promise<void> => {
        if (!worksheetId.trim()) {
            Alert.alert('Erro', 'Por favor, insira um ID de folha de obra válido.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await WorksheetService.viewDetailedWorksheet(
                parseInt(worksheetId),
                token as string,
            );

            console.log("Folha de obra detalhada mostrada.", data);
            setWorksheetData(data);
            Alert.alert('Sucesso', 'Folha de obra carregada com sucesso!', [
                { text: 'OK' },
            ]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message, [
                    {text: 'Entendido'},
                ]);
            } else {
                console.log("Erro inesperado:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado.', [
                    {text: 'Entendido'},
                ]);
            }
        } finally {
            setIsLoading(false);
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

    const formatDate = (dateString: string): string => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-PT');
        } catch {
            return '—';
        }
    };

    const renderFeatureItem = ({ item }: { item: WorksheetFeature }): JSX.Element => (
        <View style={styles.listItem}>
            <View style={styles.listItemHeader}>
                <Text style={styles.listItemTitle}>Parcela {item.polygon_id}</Text>
                <Text style={styles.listItemSubtitle}>Propriedade: {item.rural_property_id}</Text>
            </View>
            <View style={styles.listItemContent}>
                <Text style={styles.listItemDetail}>AIGP: {item.aigp}</Text>
                <Text style={styles.listItemDetail}>UI ID: {item.UI_id}</Text>
                <Text style={styles.listItemDetail}>
                    Coordenadas: {item.coordinates ? 'Disponíveis' : 'Indisponíveis'}
                </Text>
            </View>
        </View>
    );

    const renderOperationItem = ({ item }: { item: WorksheetOperation }): JSX.Element => (
        <View style={styles.listItem}>
            <View style={styles.listItemHeader}>
                <Text style={styles.listItemTitle}>{item.operation_code}</Text>
                <Text style={[styles.operationStatus, getStatusStyle(item.status)]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.listItemContent}>
                <Text style={styles.listItemDetail}>{item.operation_description}</Text>
                <Text style={styles.listItemDetail}>Área: {item.area_ha} ha</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <BackButton style={styles.backButton}/>
                    <View style={styles.header}>
                        <Text style={styles.title}>Detalhes da Folha de Obra</Text>
                        <Text style={styles.subtitle}>Visualização detalhada</Text>
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
                            editable={!isLoading}
                        />
                        <Button
                            title={isLoading ? "Carregando..." : "Pesquisar"}
                            onPress={HandleViewDetailedWorksheet}
                            color="#3b82f6"
                            disabled={isLoading}
                        />

                        {worksheetData && (
                            <View style={styles.resultsContainer}>
                                <Text style={styles.sectionTitle}>
                                    Folha de Obra #{worksheetData.metadata.id}
                                </Text>

                                {/* Metadata Section */}
                                <View style={styles.section}>
                                    <Text style={styles.subsectionTitle}>Informações Gerais</Text>
                                    <View style={styles.grid}>
                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Estado</Text>
                                            <Text style={[styles.value, getStatusStyle(worksheetData.metadata.status)]}>
                                                {worksheetData.metadata.status}
                                            </Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>AIGP</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.aigp}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Fornecedor ID</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.service_provider_id}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Usuário Emissor</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.issuing_user_id}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Início</Text>
                                            <Text style={styles.value}>{formatDate(worksheetData.metadata.starting_date)}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Término</Text>
                                            <Text style={styles.value}>{formatDate(worksheetData.metadata.finishing_date)}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Emissão</Text>
                                            <Text style={styles.value}>{formatDate(worksheetData.metadata.issue_date)}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Receção</Text>
                                            <Text style={styles.value}>{formatDate(worksheetData.metadata.award_date)}</Text>
                                        </View>

                                        <View style={styles.fullWidthGridItem}>
                                            <Text style={styles.label}>Código POSA</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.posa_code || '—'}</Text>
                                        </View>

                                        <View style={styles.fullWidthGridItem}>
                                            <Text style={styles.label}>Descrição POSA</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.posa_description || '—'}</Text>
                                        </View>

                                        <View style={styles.fullWidthGridItem}>
                                            <Text style={styles.label}>Código POSP</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.posp_code || '—'}</Text>
                                        </View>

                                        <View style={styles.fullWidthGridItem}>
                                            <Text style={styles.label}>Descrição POSP</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.posp_description || '—'}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Tipo CRS</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.crs_type || '—'}</Text>
                                        </View>

                                        <View style={styles.gridItem}>
                                            <Text style={styles.label}>Nome CRS</Text>
                                            <Text style={styles.value}>{worksheetData.metadata.crs_name || '—'}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Operations Section */}
                                <View style={styles.section}>
                                    <Text style={styles.subsectionTitle}>
                                        Operações ({worksheetData.operations.length})
                                    </Text>
                                    {worksheetData.operations.length > 0 ? (
                                        <FlatList
                                            data={worksheetData.operations}
                                            renderItem={renderOperationItem}
                                            keyExtractor={(item) => item.operation_code}
                                            scrollEnabled={false}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    ) : (
                                        <Text style={styles.emptyMessage}>Nenhuma operação encontrada.</Text>
                                    )}
                                </View>

                                {/* Features Section */}
                                <View style={styles.section}>
                                    <Text style={styles.subsectionTitle}>
                                        Parcelas ({worksheetData.features.length})
                                    </Text>
                                    {worksheetData.features.length > 0 ? (
                                        <FlatList
                                            data={worksheetData.features}
                                            renderItem={renderFeatureItem}
                                            keyExtractor={(item) => `${item.rural_property_id}_${item.polygon_id}`}
                                            scrollEnabled={false}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    ) : (
                                        <Text style={styles.emptyMessage}>Nenhuma parcela encontrada.</Text>
                                    )}
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
        position: 'relative',
        top: 0,
        left: 0,
        marginBottom: 20,
    },
    header: {
        marginTop: 10,
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 20,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
    },
    section: {
        marginBottom: 30,
    },
    subsectionTitle: {
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
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    fullWidthGridItem: {
        width: '100%',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    label: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    listItem: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    listItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    listItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
    },
    listItemSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    listItemContent: {
        gap: 4,
    },
    listItemDetail: {
        fontSize: 14,
        color: '#64748b',
    },
    operationStatus: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        textTransform: 'uppercase',
        marginLeft: 8,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        fontStyle: 'italic',
        padding: 20,
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
});