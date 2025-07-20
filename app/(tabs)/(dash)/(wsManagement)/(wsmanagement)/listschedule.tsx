import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated
} from "react-native";
import BackButton from "@/app/utils/back_button";
import WorksheetService from "@/services/SheetsIntegration";

export default function ListSchedule() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Animated values for floating orbs
    const orb1Animation = new Animated.Value(0);
    const orb2Animation = new Animated.Value(0);

    useEffect(() => {
        const animateOrb = (animatedValue: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 4000,
                        delay,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateOrb(orb1Animation, 500);
        animateOrb(orb2Animation, 0);

        // Load events
        (async () => {
            try {
                const eventsData = await WorksheetService.listSchedule(token);
                setEvents(eventsData);
            } catch (err: any) {
                setError(err.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    // Animated transforms for orbs
    const orb1Transform = orb1Animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
    });

    const orb2Transform = orb2Animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    const getLocationIcon = (location: string) => {
        if (!location) return '📍';
        if (location.toLowerCase().includes('norte')) return '🧭';
        if (location.toLowerCase().includes('sul')) return '🌅';
        if (location.toLowerCase().includes('oeste')) return '🌇';
        if (location.toLowerCase().includes('este')) return '🌄';
        return '📍';
    };

    const getStatusClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'agendado': return styles.statusScheduled;
            case 'em progresso': return styles.statusInProgress;
            case 'concluído': return styles.statusCompleted;
            case 'cancelado': return styles.statusCancelled;
            default: return styles.statusScheduled;
        }
    };

    const filteredEvents = selectedFilter === 'all'
        ? events
        : events.filter(ev => ev.event_status?.toLowerCase() === selectedFilter.toLowerCase());

    // Group events by date
    const groupedEvents: {[key: string]: any[]} = {};
    filteredEvents.forEach(event => {
        const date = event.event_start_date.split(' ')[0];
        if (!groupedEvents[date]) groupedEvents[date] = [];
        groupedEvents[date].push(event);
    });

    const uniqueStatuses = [...new Set(events.map(ev => ev.event_status))].filter(Boolean);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={styles.loadingText}>Carregando Lista...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <View style={styles.errorCard}>
                    <Text style={styles.errorIcon}>⚠️</Text>
                    <Text style={styles.errorTitle}>Erro ao carregar</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* BackButton positioned outside ScrollView with proper zIndex */}
            <View style={styles.backButtonContainer}>
                <BackButton />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Floating Orbs */}
                <View style={styles.orbsContainer}>
                    <Animated.View
                        style={[
                            styles.floatingOrb,
                            styles.orb1,
                            {
                                transform: [
                                    { translateX: orb1Transform },
                                    { translateY: orb1Transform }
                                ]
                            }
                        ]}
                    />
                    <Animated.View
                        style={[
                            styles.floatingOrb,
                            styles.orb2,
                            {
                                transform: [
                                    { translateX: orb2Transform },
                                    { translateY: orb2Transform }
                                ]
                            }
                        ]}
                    />
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Lista de Eventos</Text>
                    <Text style={styles.subtitle}>
                        Gerencie e acompanhe todos os seus eventos de forma intuitiva e eficiente
                    </Text>
                </View>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContainer}
                >
                    <TouchableOpacity
                        onPress={() => setSelectedFilter('all')}
                        style={[
                            styles.filterButton,
                            selectedFilter === 'all' ? styles.filterButtonActive : styles.filterButtonInactive
                        ]}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            selectedFilter === 'all' ? styles.filterButtonActiveText : styles.filterButtonInactiveText
                        ]}>Todos</Text>
                    </TouchableOpacity>

                    {uniqueStatuses.map(status => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => setSelectedFilter(status)}
                            style={[
                                styles.filterButton,
                                selectedFilter === status ? styles.filterButtonActive : styles.filterButtonInactive
                            ]}
                        >
                            <Text style={[
                                styles.filterButtonText,
                                selectedFilter === status ? styles.filterButtonActiveText : styles.filterButtonInactiveText
                            ]}>{status}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statIcon}>📅</Text>
                            <Text style={[styles.statValue, styles.statValueEmerald]}>
                                {events.length}
                            </Text>
                        </View>
                        <Text style={styles.statLabel}>Total de Eventos</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statIcon}>⏰</Text>
                            <Text style={[styles.statValue, styles.statValueBlue]}>
                                {events.filter(e => e.event_status?.toLowerCase() === 'agendado').length}
                            </Text>
                        </View>
                        <Text style={styles.statLabel}>Agendados</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statIcon}>🔄</Text>
                            <Text style={[styles.statValue, styles.statValueOrange]}>
                                {events.filter(e => e.event_status?.toLowerCase() === 'em progresso').length}
                            </Text>
                        </View>
                        <Text style={styles.statLabel}>Em Progresso</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <Text style={styles.statIcon}>✅</Text>
                            <Text style={[styles.statValue, styles.statValueGreen]}>
                                {events.filter(e => e.event_status?.toLowerCase() === 'concluído').length}
                            </Text>
                        </View>
                        <Text style={styles.statLabel}>Concluídos</Text>
                    </View>
                </View>

                {/* Events List */}
                <View style={styles.eventsContainer}>
                    {Object.entries(groupedEvents).map(([date, dayEvents]) => (
                        <View key={date} style={styles.dayCard}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayDate}>{date}</Text>
                                <Text style={styles.dayCount}>
                                    {dayEvents.length} evento{dayEvents.length > 1 ? 's' : ''}
                                </Text>
                            </View>

                            {dayEvents.map(event => (
                                <View key={`${event.worksheet_id}-${event.event_start_date}`} style={styles.eventCard}>
                                    <View style={styles.eventContent}>
                                        <View style={styles.eventMain}>
                                            <Text style={styles.eventIcon}>
                                                {getLocationIcon(event.event_location)}
                                            </Text>
                                            <View style={styles.eventDetails}>
                                                <View style={styles.eventHeader}>
                                                    <Text style={styles.eventId}>
                                                        WS #{event.worksheet_id}
                                                    </Text>
                                                </View>
                                                <Text style={styles.eventLocation}>
                                                    📍 {event.event_location}
                                                </Text>
                                                <Text style={styles.eventTime}>
                                                    🕐 {event.event_start_date} → {event.event_end_date}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.eventActions}>
                                            <Text style={[styles.eventStatus, getStatusClass(event.event_status)]}>
                                                {event.event_status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Empty State */}
                {Object.keys(groupedEvents).length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📅</Text>
                        <Text style={styles.emptyTitle}>
                            Nenhum evento encontrado
                        </Text>
                        <Text style={styles.emptyMessage}>
                            {selectedFilter === 'all'
                                ? 'Não há eventos agendados no momento.'
                                : `Não há eventos com status "${selectedFilter}".`
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 16,
        zIndex: 999,
        backgroundColor: 'transparent',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    orbsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 400,
        zIndex: 0,
        overflow: 'hidden',
    },
    floatingOrb: {
        position: 'absolute',
        borderRadius: 200,
        opacity: 0.15,
    },
    orb1: {
        width: 180,
        height: 180,
        backgroundColor: '#059669',
        top: -60,
        left: -60,
    },
    orb2: {
        width: 140,
        height: 140,
        backgroundColor: '#0891b2',
        bottom: -50,
        right: -50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    errorCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        width: '100%',
        maxWidth: 400,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#dc2626',
    },
    errorMessage: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    header: {
        marginTop: 100,
        paddingVertical: 16,
        alignItems: 'center',
        zIndex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        color: '#059669',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6B7280',
        paddingHorizontal: 32,
        lineHeight: 24,
    },
    filtersContainer: {
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    filterButtonActive: {
        backgroundColor: '#059669',
    },
    filterButtonInactive: {
        backgroundColor: '#e5e7eb',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    filterButtonActiveText: {
        color: 'white',
    },
    filterButtonInactiveText: {
        color: '#4b5563',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 16,
        paddingHorizontal: 8,
    },
    statCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    statValueEmerald: {
        color: '#059669',
    },
    statValueBlue: {
        color: '#2563eb',
    },
    statValueOrange: {
        color: '#ea580c',
    },
    statValueGreen: {
        color: '#16a34a',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    eventsContainer: {
        marginTop: 16,
        paddingHorizontal: 8,
    },
    dayCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f3f4f6',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    dayDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    dayCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    eventCard: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    eventContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    eventIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    eventDetails: {
        flex: 1,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    eventId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    eventLocation: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 4,
    },
    eventTime: {
        fontSize: 14,
        color: '#6B7280',
    },
    eventActions: {
        marginLeft: 8,
    },
    eventStatus: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    statusScheduled: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
    },
    statusInProgress: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
    },
    statusCompleted: {
        backgroundColor: '#dcfce7',
        color: '#166534',
    },
    statusCancelled: {
        backgroundColor: '#f3f4f6',
        color: '#6B7280',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        marginTop: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        color: '#9ca3af',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});