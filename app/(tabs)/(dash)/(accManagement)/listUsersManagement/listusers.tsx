import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ListUsers() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();
    const [isListingVisible, setIsListingVisible] = useState(false);
    const [accountData, setAccountData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const HandleListUsers = async () => {
        setIsLoading(true);
        try {
            const data = await AuthService.listUsers(token);
            console.log("Utilizadores listados com sucesso.", data);
            setAccountData(data);
            setIsListingVisible(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message, [
                    { text: 'Entendido' },
                ]);
            } else {
                console.log("Unexpected error:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatFieldName = (key: string) => {
        const fieldNames: { [key: string]: string } = {
            'username': 'Nome de Usuário',
            'email': 'Email',
            'role': 'Função',
            'status': 'Status',
            'createdAt': 'Criado em',
            'updatedAt': 'Atualizado em',
            'isPrivate': 'Privado',
            'isActive': 'Ativo'
        };
        return fieldNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const formatFieldValue = (key: string, value: any) => {
        if (typeof value === 'boolean') {
            return value ? 'Sim' : 'Não';
        }
        if (key.includes('At') && value) {
            return new Date(value).toLocaleDateString('pt-PT');
        }
        return String(value);
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho fixo no topo */}
            <View style={styles.header}>
                <BackButton />
            </View>

            {/* Conteúdo principal */}
            <View style={styles.mainContent}>
                {/* Seção hero com título */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Listar Usuários</Text>
                    <Text style={styles.heroSubtitle}>Visualize todos os usuários registrados no sistema</Text>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Botão de pesquisa */}
                    <View style={styles.searchContainer}>
                        <Pressable
                            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
                            onPress={HandleListUsers}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="white" />
                                    <Text style={styles.searchButtonText}>Carregando...</Text>
                                </View>
                            ) : (
                                <Text style={styles.searchButtonText}>🔍 Pesquisar Usuários</Text>
                            )}
                        </Pressable>
                    </View>

                    {/* Resultados */}
                    {accountData.length > 0 && isListingVisible && (
                        <View style={styles.resultsSection}>
                            <View style={styles.resultsHeader}>
                                <Text style={styles.resultsTitle}>Usuários Encontrados</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{accountData.length}</Text>
                                </View>
                            </View>

                            {accountData.map((account, index) => (
                                <View key={index} style={styles.userCard}>
                                    <View style={styles.userHeader}>
                                        <Text style={styles.userNumber}>#{index + 1}</Text>
                                        <View style={styles.userStatus}>
                                            <View style={[
                                                styles.statusDot,
                                                account.isActive !== false ? styles.activeDot : styles.inactiveDot
                                            ]} />
                                            <Text style={styles.statusText}>
                                                {account.isActive !== false ? 'Ativo' : 'Inativo'}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.userFields}>
                                        {Object.entries(account).map(([key, value]) => (
                                            <View key={key} style={styles.fieldRow}>
                                                <Text style={styles.fieldLabel}>
                                                    {formatFieldName(key)}
                                                </Text>
                                                <Text style={styles.fieldValue}>
                                                    {formatFieldValue(key, value)}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Estado vazio */}
                    {isListingVisible && accountData.length === 0 && !isLoading && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>👥</Text>
                            <Text style={styles.emptyTitle}>Nenhum usuário encontrado</Text>
                            <Text style={styles.emptySubtitle}>
                                Não há usuários registrados no sistema no momento
                            </Text>
                        </View>
                    )}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        paddingTop: 60,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    hero: {
        backgroundColor: '#6B7A3E',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 22,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    searchContainer: {
        marginBottom: 24,
    },
    searchButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    searchButtonDisabled: {
        backgroundColor: '#94a3b8',
        shadowOpacity: 0.1,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    resultsSection: {
        marginTop: 8,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    countBadge: {
        backgroundColor: '#6B7A3E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    countText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: '#6B7A3E',
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    userNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7A3E',
        backgroundColor: '#f0f4e8',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    userStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: '#22c55e',
    },
    inactiveDot: {
        backgroundColor: '#ef4444',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748b',
    },
    userFields: {
        gap: 12,
    },
    fieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 4,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        flex: 1,
        marginRight: 12,
    },
    fieldValue: {
        fontSize: 14,
        color: '#1e293b',
        flex: 2,
        textAlign: 'right',
        fontWeight: '500',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 24,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
    },
});