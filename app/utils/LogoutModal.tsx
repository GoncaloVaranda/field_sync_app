import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthService from "../../services/UsersIntegration";

interface LogoutModalProps {
    username: string;
    token: string;
    role: string;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ username, token, role }) => {
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await AuthService.logout(token);
            console.log("Logged out");
            setIsModalVisible(false);
            router.dismissTo('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Error', err.message, [{ text: 'I understand' }]);
            } else {
                console.log("Erro inesperado:", err);
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <View style={styles.usernameButton}>
            <Pressable
                onPress={() => setIsModalVisible(true)}
                style={styles.userButton}
            >
                <Text style={styles.usernameText}>{username}</Text>
                <Ionicons name="settings-outline" size={18} color="#6B7A3E" />
            </Pressable>

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalOverlayPressable}
                        onPress={() => setIsModalVisible(false)}
                    />

                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Account</Text>
                            <Pressable onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748b" />
                            </Pressable>
                        </View>

                        <View style={styles.userInfoContainer}>
                            <View style={styles.userInfo}>
                                <Ionicons name="person-circle-outline" size={24} color="#6B7A3E" />
                                <Text style={styles.modalUsername}>{username}</Text>
                            </View>

                            <View style={styles.userInfo}>
                                <Ionicons name="shield-checkmark-outline" size={24} color="#6B7A3E" />
                                <Text style={styles.modalRole}>{role}</Text>
                            </View>
                        </View>

                        {isLoading ? (
                            <ActivityIndicator size="large" color="#6B7A3E" style={styles.loader} />
                        ) : (
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    usernameButton: {
        position: "absolute",
        top: 40,
        right: 20,
    },
    userButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    usernameText: {
        marginRight: 6,
        color: '#1e293b',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalOverlayPressable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
    },
    userInfoContainer: {
        marginBottom: 25,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalUsername: {
        fontSize: 16,
        marginLeft: 10,
        color: '#1e293b',
    },
    modalRole: {
        fontSize: 16,
        marginLeft: 10,
        color: '#64748b',
    },
    logoutButton: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#dc2626',
        fontWeight: '600',
        fontSize: 16,
    },
    loader: {
        marginVertical: 20,
    },
});

export default LogoutModal;