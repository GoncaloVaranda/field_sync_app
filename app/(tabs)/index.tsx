import { Link, useRouter } from "expo-router";
import { Image, Text, View, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";

export default function Index() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isTablet = width >= 600;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.containerWrapper, isTablet && styles.tabletContainerWrapper]}>
                <View style={styles.headerSpacer} />

                <View style={styles.header}>
                    <Text style={[styles.pageTitle, isTablet && styles.tabletPageTitle]}>Field Sync</Text>
                </View>

                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={[styles.logo, isTablet && styles.tabletLogo]}
                        resizeMode="contain"
                    />
                </View>

                <View style={[styles.actionsContainer, isTablet && styles.tabletActionsContainer]}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/login")}
                    >
                        <Text style={styles.actionIcon}>🔐</Text>
                        <Text style={styles.actionTitle}>Login</Text>
                        <Text style={styles.actionDesc}>
                            Aceda à sua conta existente
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/register")}
                    >
                        <Text style={styles.actionIcon}>📝</Text>
                        <Text style={styles.actionTitle}>Registar Conta</Text>
                        <Text style={styles.actionDesc}>
                            Crie uma nova conta para começar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

// Mantenha os mesmos estilos do código anterior
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    containerWrapper: {
        flex: 1,
        padding: 20,
        maxWidth: 500,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    tabletContainerWrapper: {
        maxWidth: 800,
    },
    headerSpacer: {
        height: 100,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 42,
        fontWeight: '700',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    tabletPageTitle: {
        fontSize: 48,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: -40,
        marginBottom: -20,
    },
    logo: {
        width: 280,
        height: 280,
    },
    tabletLogo: {
        width: 320,
        height: 320,
    },
    actionsContainer: {
        gap: 20,
        marginTop: 20,
    },
    tabletActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
    },
    actionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        maxWidth: 350,
    },
    actionIcon: {
        fontSize: 28,
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1a1a1a',
    },
    actionDesc: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666666',
    },
});