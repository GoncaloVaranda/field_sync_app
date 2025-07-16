import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import AuthService from "../../services/Integration";
import BackButton from "../utils/back_button";

const Register = () => {
    const router = useRouter();
    // Required fields
    const [role, setRole] = useState("");
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
            // Handle successful registration (navigation, etc.)
            Alert.alert('Success', 'User successfully created!', [
            { text: 'OK' },
            ]);
            router.back();

        } catch (err: unknown) {
            if (err instanceof Error) {       
                console.log(err.message);
                Alert.alert('Error', err.message, [
                { text: 'I understand' },
                ]);

            } else {
 
                console.log("Unexpected error:", err);

            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

            <View style={styles.backButtonWrapper}>
                <BackButton/>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.title}>Criar Conta</Text>
            </View>

            <View style={styles.formContainer}>
            {/* Required Fields */}

                <Text style={styles.title}>Tipo de Conta:</Text>

                <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)} style={styles.input}>
                <Picker.Item label="Registered User" value="Registered User" />
                <Picker.Item label="Adherent Landowner User" value="Adherent Landowner User" />
                <Picker.Item label="Partner Operator" value="Partner Operator" />
                </Picker>

            <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#999" value={username} onChangeText={setUsername} autoCapitalize="none"/>
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/>
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry/>
            <TextInput style={styles.input} placeholder="Confirmar Password" placeholderTextColor="#999" value={confirmation} onChangeText={setConfirmation} secureTextEntry/>
            <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#999" value={name} onChangeText={setName} autoCapitalize="none" autoComplete="off" autoCorrect={false} />

            {/* Optional Fields */}
            <Text style={styles.sectionLabelText}>Campos Opcionais</Text>
            <TextInput style={styles.input} placeholder="Telefone 1" placeholderTextColor="#999" value={phone1} onChangeText={setPhone1} keyboardType="phone-pad"/>
            <TextInput style={styles.input} placeholder="Telefone 2" placeholderTextColor="#999" value={phone2} onChangeText={setPhone2} keyboardType="phone-pad"/>
            <TextInput style={styles.input} placeholder="NIC" placeholderTextColor="#999" value={nic} onChangeText={setNic}/>
            <TextInput style={styles.input} placeholder="Data emissão NIC (DD/MM/YYYY)" placeholderTextColor="#999" value={nicIssueDate} onChangeText={setNicIssueDate}/>
            <TextInput style={styles.input} placeholder="Local emissão NIC" placeholderTextColor="#999" value={nicIssuePlace} onChangeText={setNicIssuePlace}/>
            <TextInput style={styles.input} placeholder="Data expiração NIC (DD/MM/YYYY)" placeholderTextColor="#999" value={nicExpiryDate} onChangeText={setNicExpiryDate}/>
            <TextInput style={styles.input} placeholder="ID Financeiro" placeholderTextColor="#999" value={financialId} onChangeText={setFinancialId}/>
            <TextInput style={styles.input} placeholder="Employer" placeholderTextColor="#999" value={employer} onChangeText={setEmployer}/>
            <TextInput style={styles.input} placeholder="Endereço" placeholderTextColor="#999" value={address} onChangeText={setAddress}/>
            <TextInput style={styles.input} placeholder="Código Postal" placeholderTextColor="#999" value={postalCode} onChangeText={setPostalCode}/>
            <TextInput style={styles.input} placeholder="Data de nascimento (DD/MM/YYYY)" placeholderTextColor="#999" value={birthDate} onChangeText={setBirthDate}/>
            <TextInput style={styles.input} placeholder="Nacionalidade" placeholderTextColor="#999" value={nationality} onChangeText={setNationality}/>
            <TextInput style={styles.input} placeholder="País de residência" placeholderTextColor="#999" value={residenceCountry} onChangeText={setResidenceCountry}/>

            <View style={styles.buttonContainer}>
                <Button
                    title="Registar"
                    onPress={handleRegister}
                    disabled={!username || !password || !confirmation || !email || !name}
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
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 25,
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
    buttonContainer: {
        marginTop: 30,
        marginBottom: 40,
    },
    formContainer: {
        width: '100%',
        marginTop: 10,
    },
    sectionLabelText: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 25,
        marginBottom: 10,
        color: "#555",
    },

});

export default Register;