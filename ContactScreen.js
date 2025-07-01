import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function ContactScreen() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    const { fullName, email, phone, message } = form;

    if (!fullName || !email || !phone || !message) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    Alert.alert('Thank you!', 'Your message has been sent.');
    setForm({ fullName: '', email: '', phone: '', message: '' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Image source={require('../assets/logo3.png')} style={styles.logo} />
        <Text style={styles.title}>Contact Us</Text>

        {/* Full Name */}
        <View style={styles.inputTab}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={form.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
          />
        </View>

        {/* Email */}
        <View style={styles.inputTab}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputTab}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
          />
        </View>

        {/* Message */}
        <View style={styles.inputTab}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Type your message"
            multiline
            value={form.message}
            onChangeText={(text) => handleChange('message', text)}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  logo: {
    width: 170,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  inputTab: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
