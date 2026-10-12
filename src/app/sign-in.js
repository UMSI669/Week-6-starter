import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { register, signIn } from '../lib/auth';
import { signedIn } from '../store';

export default function SignInScreen() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('signIn'); // 'signIn' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegistering = mode === 'register';

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const user = isRegistering
        ? await register(username, password)
        : await signIn(username, password);
      // The root layout's guard switches to the tabs once this is dispatched.
      dispatch(signedIn(user));
    } catch (submitError) {
      setError(submitError.message);
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode(isRegistering ? 'signIn' : 'register');
    setError(null);
  };

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.form}
      >
        <Text style={styles.wordmark}>
          MOVIE<Text style={styles.gold}>wiki</Text>
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Create an account to save favorites.' : 'Welcome back.'}
        </Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#8d91a3"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#8d91a3"
          secureTextEntry
          autoComplete={isRegistering ? 'new-password' : 'current-password'}
          textContentType={isRegistering ? 'newPassword' : 'password'}
          onSubmitEditing={handleSubmit}
          style={styles.input}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#17130a" />
          ) : (
            <Text style={styles.buttonText}>{isRegistering ? 'Create account' : 'Sign in'}</Text>
          )}
        </Pressable>

        <Pressable onPress={toggleMode} style={styles.switch}>
          <Text style={styles.switchText}>
            {isRegistering ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#0d0e15',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  wordmark: {
    color: 'white',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  gold: {
    color: '#e8b84a',
  },
  subtitle: {
    color: '#a7aabd',
    marginTop: 6,
    marginBottom: 28,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#1b1d29',
    color: 'white',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  error: {
    color: '#ff7a7a',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#e8b84a',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#17130a',
    fontSize: 16,
    fontWeight: '800',
  },
  switch: {
    marginTop: 18,
    alignItems: 'center',
  },
  switchText: {
    color: '#e8b84a',
    fontSize: 14,
    fontWeight: '600',
  },
});
