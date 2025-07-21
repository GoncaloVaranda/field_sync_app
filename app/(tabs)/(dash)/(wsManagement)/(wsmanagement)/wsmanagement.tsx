import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import LogoutModal from "../../../../utils/LogoutModal";

export default function Wsmanagement() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    const operations = [
        {
            id: 1,
            title: "Importar Folha de Obra",
            description: "Importar uma nova folha de obra para o sistema",
            route: `/(tabs)/importworksheet?token=${token}&username=${username}&role=${role}`,
            icon: "📥"
        },
        {
            id: 2,
            title: "Visualização Genérica",
            description: "Visualizar informações básicas de uma folha",
            route: `/viewgenericworksheet?token=${token}&username=${username}&role=${role}`,
            icon: "📄"
        },
        {
            id: 3,
            title: "Visualização Detalhada",
            description: "Visualizar todos os detalhes de uma folha",
            route: `/viewdetailedworksheet?token=${token}&username=${username}&role=${role}`,
            icon: "🔍"
        },
        {
            id: 4,
            title: "Remover Folha de Obra",
            description: "Eliminar uma folha de obra do sistema",
            route: `/removeworksheet?token=${token}&username=${username}&role=${role}`,
            icon: "❌"
        },
        {
            id: 5,
            title: "Agendar Folha de Obra",
            description: "Agendar uma nova folha de obra",
            route: `/scheduleworksheet?token=${token}&username=${username}&role=${role}`,
            icon: "📅"
        },
        {
            id: 6,
            title: "Listar Agendamentos",
            description: "Visualizar todos os agendamentos existentes",
            route: `/listschedule?token=${token}&username=${username}&role=${role}`,
            icon: "📋"
        },
        {
            id: 7,
            title: "Calendário de Agendamentos",
            description: "Visualizar agendamentos em formato de calendário",
            route: `/schedulecalendar?token=${token}&username=${username}&role=${role}`,
            icon: "🗓️"
        }
    ];

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton style={styles.backButton} />
                <LogoutModal
                    username={username.toString()}
                    token={token.toString()}
                    role={role?.toString()}
                />
            </View>

            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Gestão de Folhas de Obra</Text>
                <Text style={styles.heroSubtitle}>Operações relacionadas com folhas de obra</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.grid}>
                    {operations.map((op) => (
                        <Pressable
                            key={op.id}
                            style={styles.card}
                            onPress={() => router.push(op.route as `${string}:${string}`)}
                            android_ripple={{ color: '#f0f0f0' }}
                        >
                            <Text style={styles.cardIcon}>{op.icon}</Text>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{op.title}</Text>
                                <Text style={styles.cardDescription}>{op.description}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 90,
        paddingHorizontal: 20,
    },
    backButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        padding: 8,
    },
    hero: {
        paddingTop: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#6B7A3E',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#6B7A3E',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: '#666',
    },
});
