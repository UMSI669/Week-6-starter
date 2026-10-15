import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import CitySearch from '../components/CitySearch';
import { Button, sharedStyles } from '../components/ui';
import { addLocation } from '../features/locations/locationsSlice';
import { colors, spacing } from '../theme/tokens';
import { validateLocation } from '../utils/validateLocation';

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}
export default function AddLocationScreen() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', lat: '', lon: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const saving = useRef(false);
  const validation = validateLocation(form);
  const save = () => {
    setSubmitted(true);
    if (!validation.valid || saving.current) return;
    saving.current = true;
    dispatch(addLocation(validation.value));
    goBack();
  };
  return <SafeAreaView style={sharedStyles.safeArea}>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={sharedStyles.content}>
        <View><Text style={sharedStyles.eyebrow}>WEATHERLY</Text><Text style={sharedStyles.title}>Add location</Text></View>
        <CitySearch onChoose={(values) => { setForm(values); setTouched({}); setSubmitted(false); }} />
        <Text style={sharedStyles.eyebrow}>LOCATION DETAILS</Text>
        <Text style={sharedStyles.copy}>Choose a search result or enter a location manually. Review the details, then save.</Text>
        {[
          ['name', 'Name', 'e.g. Home'], ['lat', 'Latitude', 'e.g. 42.2682'], ['lon', 'Longitude', 'e.g. -83.7312'],
        ].map(([field, label, placeholder]) => <View key={field}>
          <Text style={sharedStyles.label}>{label}</Text>
          <TextInput accessibilityLabel={label} keyboardType="default" autoCorrect={false} autoCapitalize={field === 'name' ? 'sentences' : 'none'}
            placeholder={placeholder} placeholderTextColor={colors.placeholder} style={sharedStyles.input} value={form[field]}
            onChangeText={(value) => setForm((previous) => ({ ...previous, [field]: value }))}
            onBlur={() => setTouched((previous) => ({ ...previous, [field]: true }))} onSubmitEditing={field === 'lon' ? save : undefined} />
          {(touched[field] || submitted) && validation.errors[field] && <Text accessibilityRole="alert" style={sharedStyles.error}>{validation.errors[field]}</Text>}
        </View>)}
        <View style={styles.actions}><Button secondary style={styles.flex} onPress={goBack}>Cancel</Button><Button style={styles.flex} onPress={save}>Save</Button></View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, actions: { flexDirection: 'row', gap: spacing.md } });
