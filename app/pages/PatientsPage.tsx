import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContextProvider";
import { useEffect, useState } from "react";
import { PatientResponse, EndpointResponse, fetchEndpointResponse, fetchPatientList } from "../apiCalls";
import { PatientTable, generatePatientRows } from '../components/PatientTable';
import styles from './general.module.css'; // Import CSS module for styling
import { Pagination, Group } from '@mantine/core';


const PatientsPage = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [patientEndpointResponse, setPatientEndpointResponse] = useState<EndpointResponse | null>(null);
  const [patientList, setPatientList] = useState<PatientResponse[]>([]);

  const [count, setCount] = useState(1);
  const [activePage, setCurrentPage] = useState(1);
  //console.log(authContext.keycloakToken);
  const defaultLimit = 20;
  const defaultOffset = 0;

  let defaultCount = 1;

  const fetchEndpointData = async (limit: number, offset: number) => {
    try {
      const patientEndpointData = await fetchEndpointResponse("patient", limit, offset, authContext, setError);
      //console.log(patientEndpointData);
      setPatientEndpointResponse(patientEndpointData);

      defaultCount = Math.ceil(patientEndpointData.count / defaultLimit);

      const fetchPatientListData = async () => {
        try {
          const patientListData = await fetchPatientList(patientEndpointData.results, authContext, setError);
          //console.log(patientListData);
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
  const setPage = (newPage: number) => {
    //console.log("setting next page...");
    if (patientEndpointResponse) {
      const new_offset = defaultOffset + (newPage - 1) * defaultLimit;
      fetchEndpointData(defaultLimit, new_offset);
    }
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (authContext.isAuthenticated && authContext.keycloakToken && authContext.username) {
      setUsername(authContext.username);
    }
    setCount(defaultCount);
    if (patientEndpointResponse == null) {
      fetchEndpointData(defaultLimit, defaultOffset).then(() => {
        // After fetchEndpointData completes, update the count
        setCount(defaultCount);
      });
    }
  }, [authContext.isAuthenticated, authContext.keycloakToken, authContext.username]);

  const rows = patientList ? generatePatientRows(patientList) : null;
  return (
    rows ? (
      <div className={styles.container} style={{ height: '100%', overflow: 'auto' }}>
        <h1>Patients</h1>
        <PatientTable rows={rows} />
        <div style={{ height: '100px', overflow: 'auto' }}> {/* Adjust the height as needed */}
          <Pagination.Root total={count} value={activePage} onChange={setPage}>
            <Group gap={5} justify="center">
              <Pagination.First />
              <Pagination.Previous />
              <Pagination.Items />
              <Pagination.Next />
              <Pagination.Last />
            </Group>
          </Pagination.Root>
        </div>
      </div>
    ) : (
      <div className={styles.container} style={{ height: '100%', overflow: 'auto' }}>
        <h1>Patients</h1>
      </div>
    )
  );
};

export default PatientsPage;
