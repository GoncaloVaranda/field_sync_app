import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import WorksheetService from "@/services/SheetsIntegration";
import { Calendar } from "react-native-calendars";

type MarkedDates = {
    [date: string]: {
        marked: boolean;
        dotColor: string;
        activeOpacity: number;
        selected?: boolean;
        selectedColor?: string;
    };
};

type Schedule = {
    worksheet_id: number;
    event_start_date: string;
    event_end_date: string;
    event_location?: string;
    event_status?: string;
};

export default function ScheduleCalendarView() {
    const router = useRouter();
    const { token } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [scheduledDates, setScheduledDates] = useState<MarkedDates>({});
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

        // Load scheduled worksheets
        (async () => {
            try {
                const data = await WorksheetService.listSchedule(token as string);
                setSchedules(data);

                // Format dates for calendar
                const markedDates: MarkedDates = {};
                data.forEach((schedule: Schedule) => {
                    const date = schedule.event_start_date.split(' ')[0];
                    markedDates[date] = {
                        marked: true,
                        dotColor: '#059669',
                        activeOpacity: 0,
                    };
                });

                setScheduledDates(markedDates);
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar agendamentos');
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

    const handleDayPress = (day: {dateString: string}) => {
        setSelectedDate(day.dateString);
    };

    const getSchedulesForSelectedDate = () => {
        if (!selectedDate) return [];
        return schedules.filter(schedule =>
            schedule.event_start_date.startsWith(selectedDate)
        );
    };

    const getStatusStyle = (status: string = '') => {
        switch (status.toLowerCase()) {
            case 'concluído': return styles.statusCompleted;
            case 'cancelado': return styles.statusCancelled;
            default: return styles.statusScheduled;
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#059669" />
                <Text style={styles.loadingText}>Carregando calendário...</Text>
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
            {/* Custom Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                disabled={loading}
            >
                <Ionicons name="arrow-back" size={24} color="#059669" />
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>

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
                    <Text style={styles.title}>Calendário de Agendamentos</Text>
                    <Text style={styles.subtitle}>
                        Visualize os dias com folhas de obra agendadas
                    </Text>
                </View>

                {/* Calendar */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        markedDates={{
                            ...scheduledDates,
                            ...(selectedDate && {
                                [selectedDate]: {
                                    selected: true,
                                    selectedColor: '#059669',
                                    ...scheduledDates[selectedDate]
                                }
                            })
                        }}
                        markingType={'multi-dot'}
                        onDayPress={handleDayPress}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#059669',
                            selectedDayBackgroundColor: '#059669',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#059669',
                            dayTextColor: '#1f2937',
                            textDisabledColor: '#d1d5db',
                            dotColor: '#059669',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#059669',
                            monthTextColor: '#059669',
                            indicatorColor: '#059669',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                            textDayFontSize: 14,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14
                        }}
                    />
                </View>

                {selectedDate && (
                    <View style={styles.schedulesContainer}>
                        <Text style={styles.sectionTitle}>
                            Agendamentos para {selectedDate}
                        </Text>

                        {getSchedulesForSelectedDate().length > 0 ? (
                            getSchedulesForSelectedDate().map((schedule, index) => (
                                <View key={`${schedule.worksheet_id}-${index}`} style={styles.scheduleCard}>
                                    <View style={styles.scheduleHeader}>
                                        <Text style={styles.scheduleId}>
                                            Folha #{schedule.worksheet_id}
                                        </Text>
                                        <View style={[styles.statusBadge, getStatusStyle(schedule.event_status)]}>
                                            <Text style={styles.statusText}>{schedule.event_status || 'Agendado'}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.scheduleTime}>
                                        🕒 {schedule.event_start_date.split(' ')[1]} - {schedule.event_end_date.split(' ')[1]}
                                    </Text>

                                    {schedule.event_location && (
                                        <Text style={styles.scheduleLocation}>
                                            📍 {schedule.event_location}
                                        </Text>
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noSchedulesText}>
                                Nenhum agendamento para este dia
                            </Text>
                        )}
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 8,
        zIndex: 10,
    },
    backButtonText: {
        marginLeft: 8,
        color: '#059669',
        fontSize: 16,
        fontWeight: '500',
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
        marginTop: 60, // Adjusted to accommodate back button
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
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    schedulesContainer: {
        marginTop: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#059669',
        marginBottom: 16,
    },
    scheduleCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    scheduleId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    scheduleTime: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 4,
    },
    scheduleLocation: {
        fontSize: 14,
        color: '#4b5563',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusScheduled: {
        backgroundColor: '#dbeafe',
    },
    statusCompleted: {
        backgroundColor: '#dcfce7',
    },
    statusCancelled: {
        backgroundColor: '#fee2e2',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    noSchedulesText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 16,
        paddingVertical: 16,
    },
});