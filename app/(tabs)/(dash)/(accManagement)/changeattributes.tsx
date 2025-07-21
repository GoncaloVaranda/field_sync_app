import BackButton from "@/app/utils/back_button";
import AuthService from "@/services/UsersIntegration";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Changeattributes() {
    const router = useRouter();
    const { token, username } = useLocalSearchParams();

    const [form, setForm] = useState({
        password: "",
        confirmation: "",
        name: "",
        phone1: "",
        phone2: "",
        nic: "",
        nicIssueDate: "",
        nicIssuePlace: "",
        nicExpiryDate: "",
        financialId: "",
        employer: "",
        address: "",
        postalCode: "",
        birthDate: "",
        nationality: "",
        residenceCountry: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const HandleChangeAttributes = async () => {
        if (!form.password || !form.confirmation) {
            Alert.alert('Erro', 'Password e confirmação são obrigatórias');
            return;
        }

        if (form.password !== form.confirmation) {
            Alert.alert('Erro', 'As passwords não coincidem');
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await AuthService.changeAttributes(
                token,
                form.password,
                form.confirmation,
                form.name,
                form.phone1,
                form.phone2,
                form.nic,
                form.nicIssueDate,
                form.nicIssuePlace,
                form.nicExpiryDate,
                form.financialId,
                form.employer,
                form.address,
                form.postalCode,
                form.birthDate,
                form.nationality,
                form.residenceCountry
            );

            console.log("Atributos alterados com sucesso:", data);
            Alert.alert('Sucesso', 'Atributos alterados com sucesso!');
            router.back();
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                Alert.alert('Erro', err.message);
            } else {
                console.log("Erro inesperado:", err);
                Alert.alert('Erro', 'Ocorreu um erro inesperado');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <BackButton style={styles.backButton} />

                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Alterar Atributos de uma conta</Text>
                    <Text style={styles.heroSubtitle}>Modifique os seus dados de conta abaixo</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Segurança</Text>
                    <Text style={styles.inputLabel}>Password*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Insira a nova password"
                        placeholderTextColor="#999"
                        value={form.password}
                        onChangeText={(text) => handleChange('password', text)}
                        secureTextEntry
                    />

                    <Text style={styles.inputLabel}>Confirmar Password*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirme a nova password"
                        placeholderTextColor="#999"
                        value={form.confirmation}
                        onChangeText={(text) => handleChange('confirmation', text)}
                        secureTextEntry
                    />

                    <Text style={styles.sectionTitle}>Informação Pessoal</Text>
                    <Text style={styles.inputLabel}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ex: Miguel Maciel"
                        placeholderTextColor="#999"
                        value={form.name}
                        onChangeText={(text) => handleChange('name', text)}
                    />

                    <Text style={styles.inputLabel}>Telefone 1</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone principal"
                        placeholderTextColor="#999"
                        value={form.phone1}
                        onChangeText={(text) => handleChange('phone1', text)}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.inputLabel}>Telefone 2</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone secundário"
                        placeholderTextColor="#999"
                        value={form.phone2}
                        onChangeText={(text) => handleChange('phone2', text)}
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.sectionTitle}>Identificação</Text>
                    <Text style={styles.inputLabel}>Número do NIC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Número do bilhete de identidade"
                        placeholderTextColor="#999"
                        value={form.nic}
                        onChangeText={(text) => handleChange('nic', text)}
                    />

                    <Text style={styles.inputLabel}>Data de Emissão NIC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor="#999"
                        value={form.nicIssueDate}
                        onChangeText={(text) => handleChange('nicIssueDate', text)}
                    />

                    <Text style={styles.inputLabel}>Local de Emissão NIC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Onde foi emitido o NIC"
                        placeholderTextColor="#999"
                        value={form.nicIssuePlace}
                        onChangeText={(text) => handleChange('nicIssuePlace', text)}
                    />

                    <Text style={styles.inputLabel}>Data de Validade NIC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor="#999"
                        value={form.nicExpiryDate}
                        onChangeText={(text) => handleChange('nicExpiryDate', text)}
                    />

                    <Text style={styles.sectionTitle}>Emprego & Morada</Text>
                    <Text style={styles.inputLabel}>ID Financeiro</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu identificador financeiro"
                        placeholderTextColor="#999"
                        value={form.financialId}
                        onChangeText={(text) => handleChange('financialId', text)}
                    />

                    <Text style={styles.inputLabel}>Empregador</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Empregador atual"
                        placeholderTextColor="#999"
                        value={form.employer}
                        onChangeText={(text) => handleChange('employer', text)}
                    />

                    <Text style={styles.inputLabel}>Morada</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Morada completa"
                        placeholderTextColor="#999"
                        value={form.address}
                        onChangeText={(text) => handleChange('address', text)}
                    />

                    <Text style={styles.inputLabel}>Código Postal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Código postal da área"
                        placeholderTextColor="#999"
                        value={form.postalCode}
                        onChangeText={(text) => handleChange('postalCode', text)}
                    />

                    <Text style={styles.sectionTitle}>Informação Adicional</Text>
                    <Text style={styles.inputLabel}>Data de Nascimento</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor="#999"
                        value={form.birthDate}
                        onChangeText={(text) => handleChange('birthDate', text)}
                    />

                    <Text style={styles.inputLabel}>Nacionalidade</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ex: PT"
                        placeholderTextColor="#999"
                        value={form.nationality}
                        onChangeText={(text) => handleChange('nationality', text)}
                    />

                    <Text style={styles.inputLabel}>País de Residência</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ex: PT"
                        placeholderTextColor="#999"
                        value={form.residenceCountry}
                        onChangeText={(text) => handleChange('residenceCountry', text)}
                    />

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        onPress={HandleChangeAttributes}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'A atualizar...' : 'Confirmar alterações'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000,
    },
    hero: {
        marginVertical: 25,
        marginTop: 70, // Add top margin to account for the back button
        paddingHorizontal: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1a365d',
        marginBottom: 5,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#718096',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d3748',
        marginTop: 20,
        marginBottom: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4a5568',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        height: 50,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f8fafc',
        color: '#1a202c',
    },
    submitButton: {
        height: 50,
        borderRadius: 8,
        backgroundColor: '#6B7A3E',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    submitButtonDisabled: {
        backgroundColor: '#a0aec0',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});