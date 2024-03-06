import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContextProvider";
import { useEffect, useState } from "react";
import { PatientResponse, EndpointResponse, fetchEndpointResponse, fetchPatientList } from "../apiCalls";
import PatientTable from '../components/PatientTable';

const PatientsPage = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [patientEndpointResponse, setPatientEndpointResponse] = useState<EndpointResponse | null>(null);
  const [patientList, setPatientList] = useState<PatientResponse[]>([]);
  //console.log(authContext.keycloakToken);
  const limit = 20;
  const offset = 0;

  useEffect(() => {
    if (authContext.isAuthenticated && authContext.keycloakToken && authContext.username) {
      setUsername(authContext.username);
    }
    const fetchEndpointData = async () => {
      try {
        const patientEndpointData = await fetchEndpointResponse("patient", limit, offset, authContext, setError);
        console.log(patientEndpointData);
        setPatientEndpointResponse(patientEndpointData);

        const fetchPatientListData = async () => {
          try {
            const patientListData = await fetchPatientList(patientEndpointData.results, authContext, setError);
            console.log(patientListData);
            setPatientList(patientListData);
          } catch (error) {
            console.error('Error occurred:', error);
            console.error('Logging out...', error);
            authContext.logout();
          }
        };
        fetchPatientListData();

      } catch (error) {
        console.error('Error occurred:', error);
        console.error('Logging out...', error);
        authContext.logout();
      }
    };
    fetchEndpointData();
  }, [authContext.isAuthenticated, authContext.keycloakToken, authContext.username]);
  return (
    <div>
      <h1>Patients</h1>
      <PatientTable patientList={patientList} />
      {/* Add content specific to patients page */}
    </div>
  );
};

export default PatientsPage;
