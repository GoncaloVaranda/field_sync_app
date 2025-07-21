import BackButton from "@/app/utils/back_button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import LogoutModal from "../../../../utils/LogoutModal";

export default function Listusersmanagement() {
    const router = useRouter();
    const { token, username, role } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            {/* Cabeçalho fixo no topo */}
            <View style={styles.header}>
                <BackButton />
                <LogoutModal
                    username={username.toString()}
                    token={token.toString()}
                    role={role.toString()}
                />
            </View>

            {/* Conteúdo principal centralizado */}
            <View style={styles.mainContent}>
                {/* Seção hero com título */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Operações de Listar</Text>
                    <Text style={styles.heroSubtitle}>Visualize diferentes tipos de usuários</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.grid}>
                        {[
                            {
                                visible: true,
                                title: "Listar Usuários",
                                desc: "Ver todos os usuários",
                                onPress: () => router.push(`/listUsersManagement/listusers?token=${token}&username=${username}&role=${role}`)
                            },
                            {
                                visible: role === "Root" || role === "System Back-Office",
                                title: "Contas Privadas",
                                desc: "Visualizar contas privadas",
                                onPress: () => router.push(`/listUsersManagement/listusersprivateaccounts?token=${token}&username=${username}&role=${role}`)
                            },
                            {
                                visible: role === "Root" || role === "System Back-Office",
                                title: "Pedidos de Remoção",
                                desc: "Usuários solicitando exclusão",
                                onPress: () => router.push(`/listUsersManagement/listusersremovalrequest?token=${token}&username=${username}&role=${role}`)
                            }
                        ].filter(item => item.visible).map((item, index) => (
                            <Pressable
                                key={index}
                                style={styles.card}
                                onPress={item.onPress}
                            >
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDesc}>{item.desc}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 200, // Espaço para a status bar
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    hero: {
        backgroundColor: '#6B7A3E',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        marginTop: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
        flexGrow: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 13,
        color: '#64748b',
    },
});