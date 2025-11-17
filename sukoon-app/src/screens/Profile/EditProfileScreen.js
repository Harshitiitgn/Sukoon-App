import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import colors from '../../theme/colors';
import TopBar from '../../components/TopBar';
import { AuthContext } from '../../context/AuthContext';
import { apiPut } from '../../utils/api';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.fullName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [emergencyContact, setEmergencyContact] = useState(
    user?.emergencyContact || ''
  );
  const [loading, setLoading] = useState(false);

  const canSave = name.trim() && mobile.trim();

  const onSave = async () => {
    if (!user?._id) {
      alert('No user loaded. Please log in again.');
      return;
    }

    if (!canSave) return;

    try {
      setLoading(true);
      const updated = await apiPut('/user/profile', {
        id: user._id,
        fullName: name.trim(),
        mobile: mobile.trim(),
        age: age ? Number(age) : undefined,
        emergencyContact: emergencyContact.trim(), // can be blank, will clear if empty
      });

      // Update in global context so Home + Profile reflect changes
      setUser(updated);
      navigation.goBack();
    } catch (err) {
      alert(err.message || 'Could not update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} />

      <Text style={styles.title}>Edit Sukoon Profile</Text>

      <InputField
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Full Name"
      />
      <InputField
        label="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
      />
      <InputField
        label="Age"
        value={age}
        onChangeText={setAge}
        placeholder="Age"
        keyboardType="number-pad"
      />
      <InputField
        label="Emergency Contact Number"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
        placeholder="e.g. 9876543210"
        keyboardType="phone-pad"
      />

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title={loading ? 'Saving...' : 'Save'}
        onPress={onSave}
        disabled={!canSave || loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 16,
  },
});
