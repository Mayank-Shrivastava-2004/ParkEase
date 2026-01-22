import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import GradientButton from '../components/GradientButton';
import { COLORS } from '../constants/colors';
import { authAPI } from '../services/api';

const ResetPasswordScreen = ({ route, navigation }) => {
    const { email: initialEmail } = route.params || {};
    const [email, setEmail] = useState(initialEmail || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.resetPassword(email, newPassword);
            Alert.alert(
                "Success",
                "Password has been reset successfully. Please login with your new password.",
                [{ text: "Login", onPress: () => navigation.navigate('PanelSelection') }]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to reset password: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Create a new strong password"
            onBack={() => navigation.goBack()}
        >
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your@email.com"
                        value={email}
                        onChangeText={setEmail}
                        editable={!initialEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <GradientButton
                    title="Update Password"
                    onPress={handleResetPassword}
                />
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    form: { gap: 20 },
    inputContainer: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16, borderColor: '#F3F4F6', borderWidth: 1 },
});

export default ResetPasswordScreen;
