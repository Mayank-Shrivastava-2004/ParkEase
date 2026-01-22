import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import GradientButton from '../components/GradientButton';
import { COLORS } from '../constants/colors';
import { authAPI } from '../services/api';

const ForgotPasswordScreen = ({ route, navigation }) => {
    const { panel } = route.params || { panel: 'Account' };
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.forgotPassword(email);
            Alert.alert(
                "Success",
                response.message || "Password reset link has been sent to your email.",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to send reset link: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle={`Reset your ${panel} password`}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your registered email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <GradientButton
                    title="Send Reset Link"
                    onPress={handleResetPassword}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Remember your password? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    form: { gap: 20 },
    inputContainer: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16, borderColor: '#F3F4F6', borderWidth: 1 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    footerText: { color: COLORS.textSub, fontSize: 14 },
    loginText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' }
});

export default ForgotPasswordScreen;
