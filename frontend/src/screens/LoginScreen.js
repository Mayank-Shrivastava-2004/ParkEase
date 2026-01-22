import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AuthLayout from '../components/AuthLayout';
import GradientButton from '../components/GradientButton';
import { COLORS } from '../constants/colors';
import { authAPI, setAuthToken } from '../services/api';

const LoginScreen = ({ route, navigation }) => {
    const { title, panel, dashboardScreen } = route.params;
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !pass) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const credentials = {
                email,
                password: pass,
                role: panel === 'Admin Panel' ? 'admin' : (panel === 'Driver Panel' ? 'driver' : 'provider')
            };

            const response = await authAPI.login(credentials);

            // Save token
            if (response.token) {
                setAuthToken(response.token);
            }

            alert('Login Successful!');
            navigation.navigate(dashboardScreen);
        } catch (error) {
            alert('Login Failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle={`Login to your ${panel}`}
            onBack={() => navigation.goBack()}
        >
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        secureTextEntry
                        value={pass}
                        onChangeText={setPass}
                    />
                </View>

                <TouchableOpacity
                    style={styles.forgotPass}
                    onPress={() => navigation.navigate('ForgotPassword', { panel })}
                >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <GradientButton
                    title="Login"
                    onPress={handleLogin}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate(panel === 'Admin Panel' ? 'AdminRegister' : (panel === 'Driver Panel' ? 'DriverRegister' : 'ProviderRegister'))}>
                        <Text style={styles.registerText}>Register Now</Text>
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
    forgotPass: { alignSelf: 'flex-end', marginTop: -10 },
    forgotText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
    footerText: { color: COLORS.textSub, fontSize: 14 },
    registerText: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' }
});

export default LoginScreen;
