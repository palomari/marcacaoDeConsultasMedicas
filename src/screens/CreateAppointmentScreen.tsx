import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import DoctorList from '../components/DoctorList';
import TimeSlotList from '../components/TimeSlotList';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// Lista de médicos disponíveis
const availableDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dra. Julia Ortiz',
    specialty: 'endocrinologista',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQGhx7duVA-Iog/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1696187494408?e=2147483647&v=beta&t=JhvOFt1InzgUDDUHUuLWzAtZite6_AXvHTKcLI_7YXE',
 },
 {
     id: '2',
     name: 'Dra. Julia Palomari',
     specialty: 'Ginecologista e Obstetra',
     image: 'https://media-gru2-1.cdn.whatsapp.net/v/t61.24694-24/394128618_353863357081936_4877780367150686629_n.jpg?ccb=11-4&oh=01_Q5AaIRv8cLHFAGewMXJ46cEy1K1Vdz_wiHW_dhDxzVk_EnDl&oe=67F2417C&_nc_sid=5e03e0&_nc_cat=103',
 },
 {
    id: '3',
    name: 'Dr. Leticia Baptista',
    specialty: 'Pediatra',
    image: 'data:image/jpeg;base64,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',
 },
];

const CreateAppointmentScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Recupera consultas existentes
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Cria nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: user?.id || '',
        patientName: user?.name || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time: selectedTime,
        specialty: selectedDoctor.specialty,
        status: 'pending',
      };

      // Adiciona nova consulta à lista
      appointments.push(newAppointment);

      // Salva lista atualizada
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      alert('Consulta agendada com sucesso!');
      navigation.goBack();
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {error ? <ErrorText>{error}</ErrorText> : null}

        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default CreateAppointmentScreen;