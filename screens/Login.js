import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; 

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Input Error', 'Both Email and Password are required');
      return;
    }

    setLoading(true);

    try {
    
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      
      await AsyncStorage.setItem('userToken', result.token);
      navigation.replace('Home'); 

    } catch (error) {
      navigation.replace('Home'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('D:/program/javascript/my-app/img/loginimg.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Login</Text>

    
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email ID"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      
      </View>

    
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { paddingRight: 40 }]} 
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
       
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <FontAwesome
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.forgotPassword}>Forgot Password?</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
    
        <Button title="Login" style={styles.login} onPress={handleLogin} />
    
      )}

  
      <View style={styles.bottomTextContainer}>
        <Text style={styles.register}>New to Login? <Text style={styles.registerHighlight}>Register</Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  image: {
    width: 400,
    height: 250,
    alignSelf: 'center',
    marginTop: -90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222f45',
    textAlign: 'left',
    marginBottom: 20,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  inputIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 18,
    color: 'grey',
  },
  eyeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#2560c4',
    margin: 10,
    fontWeight: 'bold',
  },
  register: {
    textAlign: 'center',
    color: 'grey',
  },
  registerHighlight: {
    color: '#2560c4',
    fontWeight: 'bold',
  },
  login: {
    padding: 2,
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
});

export default Login;
