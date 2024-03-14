import React, { useContext } from 'react';
import { Title, Button } from '@mantine/core';
import { AuthContext } from "../context/AuthContextProvider";
import { useEffect, useState } from "react";
import { PatientResponse, DoctorResponse, AppointmentResponse, EndpointResponse, fetchEndpointResponse, fetchPatientList, fetchDoctorList, fetchAppointmentList } from "../apiCalls";
import DoctorTable from '../components/DoctorTable';
import AppointmentTable from '../components/AppointmentTable';
import styles from './general.module.css'; // Import CSS module for styling
import Image from 'next/image';



export default function Home() {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [patientEndpointResponse, setPatientEndpointResponse] = useState<EndpointResponse | null>(null);
  const [patientList, setPatientList] = useState<PatientResponse[]>([]);

  const [doctorEndpointResponse, setDoctorEndpointResponse] = useState<EndpointResponse | null>(null);
  const [doctorList, setDoctorList] = useState<DoctorResponse[]>([]);
  
  const [appointmentEndpointResponse, setAppointmentEndpointResponse] = useState<EndpointResponse | null>(null);
  const [appointmentList, setAppointmentList] = useState<AppointmentResponse[]>([]);

  const [activeTable, setActiveTable] = useState('patient');
  //console.log(authContext.keycloakToken);
  const limit = 20;
  const offset = 0;

  useEffect(() => {
    if (authContext.isAuthenticated && authContext.keycloakToken && authContext.username) {
      setUsername(authContext.username);
    }
  }, [authContext.isAuthenticated, authContext.keycloakToken, authContext.username]);

  return (
    <div className={styles.container}>
      <center>
      <Title>Hello, {username}</Title>
      <br />
      <Button onClick={authContext.logout}>Logout</Button>
      </center>
    </div>
  );
}
