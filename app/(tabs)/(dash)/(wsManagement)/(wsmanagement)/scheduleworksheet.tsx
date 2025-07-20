import BackButton from "@/app/utils/back_button";
import WorksheetService from "@/services/SheetsIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Animated, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ScheduleWorksheet() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const [worksheetId, setWorksheetId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Animated values for floating orbs
    const orb1Animation = new Animated.Value(0);
    const orb2Animation = new Animated.Value(0);

    React.useEffect(() => {
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
    }, []);

    const handleScheduleWorksheet = async () => {
        // Validação de campo obrigatório
        if (!worksheetId.trim()) {
            Alert.alert('Erro', 'Por favor, insira o ID da folha de obra', [
                { text: 'OK' }
            ]);
            return;
        }

        // Validação se é um número válido
        const numericId = parseInt(worksheetId.trim(), 10);
        if (isNaN(numericId) || numericId <= 0) {
            Alert.alert('Erro', 'Por favor, insira um ID válido (número maior que 0)', [
                { text: 'OK' }
            ]);
            return;
        }

        setIsLoading(true);
        try {
            console.log('📅 Agendando folha de obra...');
            console.log('- Worksheet ID:', numericId);

            const scheduleData = await WorksheetService.scheduleWorksheet(numericId, token);

            console.log('✅ Folha agendada com sucesso:', scheduleData);

            Alert.alert(
                'Sucesso!',
                `Agendamento #${numericId} criado com sucesso!`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setWorksheetId("");
                            router.back();
                        }
                    }
                ]
            );

        } catch (err: unknown) {
            console.error('❌ Erro ao agendar folha:', err);

            if (err instanceof Error) {
                // Tratar mensagens de erro específicas do backend
                let errorMessage = err.message;

                if (errorMessage.includes('invalid or expired token')) {
                    errorMessage = 'Token de autenticação inválido ou expirado. Faça login novamente.';
                } else if (errorMessage.includes('permission')) {
                    errorMessage = 'Você não tem permissão para agendar folhas de obra.';
                } else if (errorMessage.includes('not found')) {
                    errorMessage = `Folha de obra com ID ${numericId} não foi encontrada.`;
                } else if (errorMessage.includes('already exists')) {
                    errorMessage = `Já existe um agendamento para a folha de obra #${numericId}.`;
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
        setWorksheetId("");
    };

    // Animated transforms for orbs
    const orb1Transform = orb1Animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
    });

    const orb2Transform = orb2Animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <BackButton />
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                

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

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Agendamento de Folhas de Obra</Text>
                    <Text style={styles.heroSubtitle}>
                        Agende folhas de obra para processamento futuro
                    </Text>
                </View>

                {/* Main Form Section */}
                <View style={styles.mainSection}>
                    <View style={styles.formContainer}>
                        <Text style={styles.sectionTitle}>Informações do Agendamento</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>ID da Folha de Obra *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite o ID da folha"
                                value={worksheetId}
                                onChangeText={setWorksheetId}
                                autoCapitalize="none"
                                editable={!isLoading}
                                keyboardType="numeric"
                            />
                            <Text style={styles.helpText}>
                                Insira o ID numérico da folha de obra que deseja agendar
                            </Text>
                        </View>

                        <View style={styles.buttonRow}>
                            <View style={styles.halfButton}>
                                <Button
                                    title="Limpar"
                                    onPress={clearForm}
                                    disabled={isLoading}
                                    color="#6B7280"
                                />
                            </View>
                            <View style={styles.halfButton}>
                                <Button
                                    title={isLoading ? "Agendando..." : "Agendar Folha"}
                                    onPress={handleScheduleWorksheet}
                                    disabled={isLoading}
                                    color="#059669"
                                />
                            </View>
                        </View>

                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>📋 Informações do Agendamento</Text>
                            <Text style={styles.infoText}>• O agendamento criará um evento no calendário</Text>
                            <Text style={styles.infoText}>• As datas serão baseadas na folha de obra original</Text>
                            <Text style={styles.infoText}>• O status inicial será Agendado</Text>
                            <Text style={styles.infoText}>• Apenas uma folha pode ser agendada por vez</Text>
                        </View>

                        <View style={styles.warningContainer}>
                            <Text style={styles.warningTitle}>⚠️ Atenção</Text>
                            <Text style={styles.warningText}>
                                Certifique-se de que a folha de obra existe no sistema antes de agendar.
                                Não é possível agendar a mesma folha duas vezes.
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
    heroSection: {
        marginTop: 100,
        paddingVertical: 32,
        alignItems: 'center',
        zIndex: 1,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
        color: '#059669',
        paddingHorizontal: 20,
        lineHeight: 34,
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: "center",
        color: '#6B7280',
        paddingHorizontal: 32,
        lineHeight: 24,
        maxWidth: 600,
    },
    mainSection: {
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        marginHorizontal: 4,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    formContainer: {
        padding: 28,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 24,
        color: '#111827',
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderColor: "#D1D5DB",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    helpText: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 6,
        fontStyle: 'italic',
        lineHeight: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    halfButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContainer: {
        backgroundColor: '#ecfdf5',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#059669',
        marginBottom: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        color: '#065f46',
    },
    infoText: {
        fontSize: 14,
        color: '#047857',
        marginBottom: 6,
        lineHeight: 20,
    },
    warningContainer: {
        backgroundColor: '#fef3c7',
        padding: 20,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#92400e',
    },
    warningText: {
        fontSize: 14,
        color: '#92400e',
        lineHeight: 20,
        fontStyle: 'italic',
    },
});