import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";


export default function ListUsersPrivateAccount() {
    const router = useRouter();
    const {token, username} = useLocalSearchParams();
    const [accountData, setAccountData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListingVisible, setIsListingVisible] = useState(false);

    const HandleListUsersPrivateAccounts = async () => {
        setIsLoading(true);
        try {
            const data = await AuthService.listUsersPrivateAccounts(
                token,
            );

            console.log("Utilizadores com conta privado listados com sucesso.", data);
            setAccountData(data);
            setIsListingVisible(true);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Error', err.message, [
                    {text: 'I understand'},
                ]);
            } else {
                console.log("Unexpected error:", err);
            }
        }finally{
            setIsLoading(false);
        }
    };

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <BackButton/>
                <View style={styles.mainContent}>
                    <Text style={styles.title}>Listar contas privadas</Text>
                </View>


                <View style={styles.buttonContainer}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#51ff009f" />
                                        ) : (
                            <Button title="Pesquisar" onPress={HandleListUsersPrivateAccounts} color="#51ff009f" />
                        )}
                </View>

                {accountData.length > 0 && isListingVisible &&  (
                        <View style={styles.resultContainer} >
                            <Text style={styles.resultTitle}>Contas:</Text>
                
                            {accountData.map((account, index) => (
                            <View key={index} style={{ marginBottom: 16 }}>
                                 {Object.entries(account).map(([key, value]) => (
                                <Text key={key} style={styles.resultText} >
                                    {key}: {String(value)}
                                </Text>
                                ))}
                                <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 8 }} />
                            </View>
                            ))}
                        </View>
                        )}
                                
                {isListingVisible && accountData.length === 0 && !isLoading &&(
                        <Text style={styles.smallerText}>Nenhum resultado encontrado</Text>
                    )}


            </ScrollView>
        </SafeAreaView>

    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    backButtonWrapper: {
        position: 'absolute',
        top: 40,
        left: 15,
        zIndex: 10,
    },
    mainContent: {
        marginTop: 80,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: '#333',
    },
    smallerText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
    },
    stateOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    stateText: {
        fontSize: 16,
        color: '#333',
    },
    resultContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    resultText: {
        marginBottom: 8,
    }
});