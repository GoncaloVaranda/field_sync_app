import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {JSX, useState, useMemo, useEffect} from "react";
import {Alert, Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, FlatList, Dimensions} from "react-native";
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import WorksheetService from "@/services/SheetsIntegration";

const { width, height } = Dimensions.get('window');

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
    ui_id: number;
    aigp: string;
    geometry: {
        type: string;
        coordinates: number[][][];
    } | null;
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

interface MapPolygon {
    coordinates: { latitude: number; longitude: number }[];
    polygon_id: number;
    rural_property_id: string;
    color: string;
}

export default function ViewDetailedWorksheet(): JSX.Element {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [worksheetId, setWorksheetId] = useState<string>("");
    const [worksheetData, setWorksheetData] = useState<DetailedWorksheetData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showMap, setShowMap] = useState<boolean>(false);

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

            console.log("Folha de obra detalhada recebida:", JSON.stringify(data, null, 2));
            setWorksheetData(data);

            // @ts-ignore
            const hasValidCoordinates = data.features?.some(feature =>
                feature.geometry &&
                feature.geometry.coordinates &&
                Array.isArray(feature.geometry.coordinates) &&
                feature.geometry.coordinates.length > 0
            );

            if (hasValidCoordinates) {
                setShowMap(true);
            }

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

    // Função para transformar coordenadas EPSG:3763 para WGS84 (se necessário)
    const transformCoordinates = (coords: number[]): { latitude: number; longitude: number } | null => {
        if (!coords || coords.length < 2) {
            console.warn('Coordenadas inválidas:', coords);
            return null;
        }

        const [x, y] = coords;

        // Verificar se são números válidos
        if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            console.warn('Coordenadas não são números válidos:', coords);
            return null;
        }

        // Se são coordenadas EPSG:3763 (valores típicos para Portugal Continental)
        // Para simplificar, vamos assumir uma transformação aproximada
        // Em produção, seria melhor usar uma biblioteca de transformação de coordenadas
        if (Math.abs(x) > 1000 && Math.abs(y) > 1000) {
            // Transformação aproximada EPSG:3763 para WGS84
            // Esta é uma aproximação simplificada - use proj4 para maior precisão
            const lon = -8.133108333333334 + (x / 111320.0);
            const lat = 39.66825833333333 + (y / 110540.0);

            // Validar se está dentro dos limites de Portugal
            if (lon >= -10 && lon <= -6 && lat >= 36 && lat <= 42) {
                return { latitude: lat, longitude: lon };
            } else {
                console.warn('Coordenadas transformadas fora dos limites de Portugal:', { lat, lon });
                return null;
            }
        }

        // Se já são coordenadas WGS84, validar se estão dentro dos limites de Portugal
        if (x >= -10 && x <= -6 && y >= 36 && y <= 42) {
            return { latitude: y, longitude: x };
        }

        console.warn('Coordenadas fora dos limites esperados para Portugal:', coords);
        return null;
    };

    const getPolygonColor = (index: number): string => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7DBDD'
        ];
        return colors[index % colors.length];
    };

    const mapPolygons: MapPolygon[] = useMemo(() => {
        if (!worksheetData?.features) {
            console.log('Sem features para processar');
            return [];
        }

        console.log('Processando features:', worksheetData.features.length);

        const validPolygons: MapPolygon[] = [];

        worksheetData.features.forEach((feature, index) => {
            console.log(`Processando feature ${index}:`, {
                rural_property_id: feature.rural_property_id,
                polygon_id: feature.polygon_id,
                hasGeometry: !!feature.geometry,
                hasCoordinates: !!(feature.geometry?.coordinates),
                coordinatesLength: feature.geometry?.coordinates?.length
            });

            if (!feature.geometry || !feature.geometry.coordinates || !Array.isArray(feature.geometry.coordinates)) {
                console.warn(`Feature ${index} sem coordenadas válidas`);
                return;
            }

            const rings = feature.geometry.coordinates;
            if (rings.length === 0) {
                console.warn(`Feature ${index} sem anéis de coordenadas`);
                return;
            }

            const outerRing = rings[0];
            if (!Array.isArray(outerRing) || outerRing.length < 3) {
                console.warn(`Feature ${index} com anel insuficiente:`, outerRing?.length);
                return;
            }

            const transformedCoords: { latitude: number; longitude: number }[] = [];

            for (const coord of outerRing) {
                const transformed = transformCoordinates(coord);
                if (transformed) {
                    transformedCoords.push(transformed);
                }
            }

            if (transformedCoords.length < 3) {
                console.warn(`Feature ${index} com poucas coordenadas válidas após transformação:`, transformedCoords.length);
                return;
            }

            const firstPoint = transformedCoords[0];
            const lastPoint = transformedCoords[transformedCoords.length - 1];
            if (firstPoint.latitude !== lastPoint.latitude || firstPoint.longitude !== lastPoint.longitude) {
                transformedCoords.push(firstPoint);
            }

            const polygon: MapPolygon = {
                coordinates: transformedCoords,
                polygon_id: feature.polygon_id,
                rural_property_id: feature.rural_property_id,
                color: getPolygonColor(index)
            };

            validPolygons.push(polygon);
            console.log(`Feature ${index} processada com sucesso - ${transformedCoords.length} pontos`);
        });

        console.log(`Processamento concluído: ${validPolygons.length} polígonos válidos de ${worksheetData.features.length} features`);
        return validPolygons;
    }, [worksheetData]);

    const mapRegion = useMemo(() => {
        if (mapPolygons.length === 0) {
            console.log('Usando região padrão - centro de Portugal');
            return {
                latitude: 39.5,
                longitude: -8.0,
                latitudeDelta: 1.0,
                longitudeDelta: 1.0,
            };
        }

        let minLat = Infinity;
        let maxLat = -Infinity;
        let minLng = Infinity;
        let maxLng = -Infinity;

        mapPolygons.forEach(polygon => {
            polygon.coordinates.forEach(coord => {
                minLat = Math.min(minLat, coord.latitude);
                maxLat = Math.max(maxLat, coord.latitude);
                minLng = Math.min(minLng, coord.longitude);
                maxLng = Math.max(maxLng, coord.longitude);
            });
        });

        const latDelta = Math.max(maxLat - minLat, 0.01) * 1.5;
        const lngDelta = Math.max(maxLng - minLng, 0.01) * 1.5;

        const region = {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
        };

        console.log('Região calculada:', region);
        return region;
    }, [mapPolygons]);

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

    const renderFeatureItem = ({ item, index }: { item: WorksheetFeature; index: number }): JSX.Element => (
        <View style={styles.listItem}>
            <View style={styles.listItemHeader}>
                <View style={styles.featureHeaderLeft}>
                    <View style={[styles.colorIndicator, { backgroundColor: getPolygonColor(index) }]} />
                    <View>
                        <Text style={styles.listItemTitle}>Parcela {item.polygon_id}</Text>
                        <Text style={styles.listItemSubtitle}>Propriedade: {item.rural_property_id}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.listItemContent}>
                <Text style={styles.listItemDetail}>AIGP: {item.aigp}</Text>
                <Text style={styles.listItemDetail}>UI ID: {item.ui_id}</Text>
                <Text style={styles.listItemDetail}>
                    Coordenadas: {item.geometry?.coordinates ? 'Disponíveis' : 'Indisponíveis'}
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

                                {/* Map Toggle Button */}
                                {mapPolygons.length > 0 && (
                                    <View style={styles.mapToggleContainer}>
                                        <Button
                                            title={showMap ? "Ocultar Mapa" : "Ver Mapa das Parcelas"}
                                            onPress={() => setShowMap(!showMap)}
                                            color="#10b981"
                                        />
                                        <Text style={styles.mapInfo}>
                                            {mapPolygons.length} parcela(s) com coordenadas disponíveis
                                        </Text>
                                    </View>
                                )}

                                {/* Map Section */}
                                {showMap && mapPolygons.length > 0 && (
                                    <View style={styles.section}>
                                        <Text style={styles.subsectionTitle}>Mapa das Parcelas</Text>
                                        <View style={styles.mapContainer}>
                                            <MapView
                                                style={styles.map}
                                                provider={PROVIDER_GOOGLE}
                                                initialRegion={mapRegion}
                                                region={mapRegion}
                                                showsUserLocation={false}
                                                showsMyLocationButton={false}
                                                toolbarEnabled={false}
                                                zoomEnabled={true}
                                                scrollEnabled={true}
                                                pitchEnabled={false}
                                                rotateEnabled={false}
                                            >
                                                {mapPolygons.map((polygon, index) => (
                                                    <Polygon
                                                        key={`polygon_${polygon.rural_property_id}_${polygon.polygon_id}`}
                                                        coordinates={polygon.coordinates}
                                                        fillColor={`${polygon.color}40`}
                                                        strokeColor={polygon.color}
                                                        strokeWidth={2}
                                                        tappable={true}
                                                        onPress={() => {
                                                            Alert.alert(
                                                                `Parcela ${polygon.polygon_id}`,
                                                                `Propriedade: ${polygon.rural_property_id}\nCor: ${polygon.color}`,
                                                                [{ text: 'OK' }]
                                                            );
                                                        }}
                                                    />
                                                ))}

                                                {/* Markers for polygon centers */}
                                                {mapPolygons.map((polygon, index) => {
                                                    if (polygon.coordinates.length === 0) return null;

                                                    const centerLat = polygon.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / polygon.coordinates.length;
                                                    const centerLng = polygon.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / polygon.coordinates.length;

                                                    return (
                                                        <Marker
                                                            key={`marker_${polygon.rural_property_id}_${polygon.polygon_id}`}
                                                            coordinate={{
                                                                latitude: centerLat,
                                                                longitude: centerLng
                                                            }}
                                                            title={`Parcela ${polygon.polygon_id}`}
                                                            description={`Propriedade: ${polygon.rural_property_id}`}
                                                            pinColor={polygon.color}
                                                        />
                                                    );
                                                })}
                                            </MapView>
                                        </View>

                                        {/* Map Legend */}
                                        <View style={styles.mapLegend}>
                                            <Text style={styles.legendTitle}>Legenda:</Text>
                                            <ScrollView style={styles.legendScroll} nestedScrollEnabled={true}>
                                                {mapPolygons.map((polygon, index) => (
                                                    <View key={`legend_${index}`} style={styles.legendItem}>
                                                        <View style={[styles.legendColor, { backgroundColor: polygon.color }]} />
                                                        <Text style={styles.legendText}>
                                                            Parcela {polygon.polygon_id} - {polygon.rural_property_id}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    </View>
                                )}

                                {/* Informação se não há coordenadas */}
                                {mapPolygons.length === 0 && worksheetData.features.length > 0 && (
                                    <View style={styles.noMapContainer}>
                                        <Text style={styles.noMapText}>
                                            Esta folha de obra não possui coordenadas válidas para exibição no mapa.
                                        </Text>
                                    </View>
                                )}

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
    mapToggleContainer: {
        marginBottom: 20,
    },
    mapInfo: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 8,
        fontStyle: 'italic',
    },
    mapContainer: {
        height: 400, // Aumentei a altura para melhor visualização
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    map: {
        flex: 1,
    },
    mapLegend: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        maxHeight: 200, // Limitar altura da legenda
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
    },
    legendScroll: {
        maxHeight: 120,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    legendText: {
        fontSize: 14,
        color: '#64748b',
        flex: 1,
    },
    noMapContainer: {
        backgroundColor: '#fef3c7',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    noMapText: {
        fontSize: 14,
        color: '#92400e',
        textAlign: 'center',
        fontStyle: 'italic',
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
    featureHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
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
        marginLeft: 24, // Align with the text next to color indicator
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