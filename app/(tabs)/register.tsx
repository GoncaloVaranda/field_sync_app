import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import AuthService from "../../services/UsersIntegration";
import BackButton from "../utils/back_button";

const Register = () => {
    const router = useRouter();
    // Required fields
    const [role, setRole] = useState("Registered User");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    // Optional fields
    const [phone1, setPhone1] = useState("");
    const [phone2, setPhone2] = useState("");
    const [nic, setNic] = useState("");
    const [nicIssueDate, setNicIssueDate] = useState("");
    const [nicIssuePlace, setNicIssuePlace] = useState("");
    const [nicExpiryDate, setNicExpiryDate] = useState("");
    const [financialId, setFinancialId] = useState("");
    const [employer, setEmployer] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [nationality, setNationality] = useState("");
    const [residenceCountry, setResidenceCountry] = useState("");

    const [showOptional, setShowOptional] = useState(false);
    const isAdminRole = role === "Adherent Landowner User" || role === "Partner Operator";

    const handleRegister = async () => {

        try {
            const data = await AuthService.register(
                username,
                email,
                password,
                name,
                nationality,
                residenceCountry,
                address,
                postalCode,
                phone1,
                phone2,
                confirmation,
                nic,
                nicIssueDate,
                nicIssuePlace,
                nicExpiryDate,
                financialId,
                employer,
                birthDate,
                role,
            );

            console.log("Registado com sucesso:", data);
            Alert.alert('Sucesso', 'Utilizador criado com sucesso!');
            router.back();

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message);
            } else {
                console.log("Unexpected error:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado');
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.backButtonWrapper}>
                    <BackButton/>
                </View>

                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Criar Conta</Text>
                </View>

                <View style={styles.formContainer}>
                    {/* Tipo de Conta */}
                    <Text style={styles.label}>Tipo de Conta</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={role}
                            onValueChange={setRole}
                            style={styles.picker}
                            dropdownIconColor="#6B7A3E"
                        >
                            <Picker.Item label="Registered User (RU)" value="Registered User" />
                            <Picker.Item label="Adherent Landowner User (ADLU)" value="Adherent Landowner User" />
                            <Picker.Item label="Partner Operator (PO)" value="Partner Operator" />
                        </Picker>
                    </View>

                    {isAdminRole && (
                        <View style={styles.adminWarning}>
                            <Text style={styles.warningText}>⚠️ Atenção: Este tipo de conta requer campos adicionais obrigatórios.</Text>
                        </View>
                    )}

                    {/* Campos obrigatórios */}
                    <Text style={styles.label}>Username *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Escolha um username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Crie uma password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmar Password *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirme a password"
                        value={confirmation}
                        onChangeText={setConfirmation}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Nome Completo *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome completo"
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Campos obrigatórios para admin */}
                    {isAdminRole && (
                        <>
                            <Text style={styles.sectionTitle}>Informações Adicionais Obrigatórias</Text>

                            <Text style={styles.label}>Telefone Principal *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+351912345678"
                                value={phone1}
                                onChangeText={setPhone1}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>NIC *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="12345678X"
                                value={nic}
                                onChangeText={setNic}
                            />

                            <Text style={styles.label}>Data Emissão NIC *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/AAAA"
                                value={nicIssueDate}
                                onChangeText={setNicIssueDate}
                            />

                            <Text style={styles.label}>Local Emissão NIC *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Local de emissão"
                                value={nicIssuePlace}
                                onChangeText={setNicIssuePlace}
                            />

                            <Text style={styles.label}>Data Validade NIC *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/AAAA"
                                value={nicExpiryDate}
                                onChangeText={setNicExpiryDate}
                            />

                            <Text style={styles.label}>ID Financeiro *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="123456789"
                                value={financialId}
                                onChangeText={setFinancialId}
                            />

                            <Text style={styles.label}>Empregador *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome do empregador"
                                value={employer}
                                onChangeText={setEmployer}
                            />

                            <Text style={styles.label}>Endereço *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Rua, número"
                                value={address}
                                onChangeText={setAddress}
                            />

                            <Text style={styles.label}>Código Postal *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="1000-001"
                                value={postalCode}
                                onChangeText={setPostalCode}
                            />
                        </>
                    )}

                    {/* Campos opcionais para RU */}
                    {role === "Registered User" && (
                        <>
                            <Text style={styles.label}>Telefone (opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+351912345678"
                                value={phone1}
                                onChangeText={setPhone1}
                                keyboardType="phone-pad"
                            />
                        </>
                    )}

                    {/* Seção de campos opcionais */}
                    <View style={styles.optionalHeader}>
                        <Text
                            style={styles.optionalTitle}
                            onPress={() => setShowOptional(!showOptional)}
                        >
                            {showOptional ? '▼' : '▶'} Campos Opcionais
                        </Text>
                    </View>

                    {showOptional && (
                        <View style={styles.optionalFields}>
                            <Text style={styles.label}>Telefone Secundário</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+351912345678"
                                value={phone2}
                                onChangeText={setPhone2}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Data de Nascimento</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="DD/MM/AAAA"
                                value={birthDate}
                                onChangeText={setBirthDate}
                            />

                            <Text style={styles.label}>Nacionalidade</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="PT"
                                value={nationality}
                                onChangeText={setNationality}
                            />

                            <Text style={styles.label}>País de Residência</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="PT"
                                value={residenceCountry}
                                onChangeText={setResidenceCountry}
                            />

                            {role === "Registered User" && (
                                <>
                                    <Text style={styles.label}>NIC</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="12345678X"
                                        value={nic}
                                        onChangeText={setNic}
                                    />

                                    <Text style={styles.label}>Data Emissão NIC</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="DD/MM/AAAA"
                                        value={nicIssueDate}
                                        onChangeText={setNicIssueDate}
                                    />

                                    <Text style={styles.label}>Local Emissão NIC</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Local de emissão"
                                        value={nicIssuePlace}
                                        onChangeText={setNicIssuePlace}
                                    />

                                    <Text style={styles.label}>Data Validade NIC</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="DD/MM/AAAA"
                                        value={nicExpiryDate}
                                        onChangeText={setNicExpiryDate}
                                    />

                                    <Text style={styles.label}>ID Financeiro</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123456789"
                                        value={financialId}
                                        onChangeText={setFinancialId}
                                    />

                                    <Text style={styles.label}>Empregador</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nome do empregador"
                                        value={employer}
                                        onChangeText={setEmployer}
                                    />

                                    <Text style={styles.label}>Endereço</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Rua, número"
                                        value={address}
                                        onChangeText={setAddress}
                                    />

                                    <Text style={styles.label}>Código Postal</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="1000-001"
                                        value={postalCode}
                                        onChangeText={setPostalCode}
                                    />
                                </>
                            )}
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Registar"
                            onPress={handleRegister}
                            disabled={!username || !password || !confirmation || !email || !name}
                            color="#6B7A3E"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    backButtonWrapper: {
        position: 'absolute',
        top: 40,
        left: 15,
        zIndex: 10,
    },
    header: {
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#1e293b',
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        height: 50,
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#ffffff',
        color: '#334155',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#334155',
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginTop: 20,
        marginBottom: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    optionalHeader: {
        marginTop: 25,
        marginBottom: 10,
    },
    optionalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7A3E',
    },
    optionalFields: {
        marginTop: 10,
    },
    adminWarning: {
        backgroundColor: '#fff3cd',
        borderWidth: 1,
        borderColor: '#ffeaa7',
        borderRadius: 6,
        padding: 12,
        marginBottom: 15,
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
    },
});

export default Register;
