import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContextProvider";
import { useEffect, useState } from "react";
import {  DoctorResponse, EndpointResponse, fetchEndpointResponse, fetchDoctorList,  } from "../apiCalls";
import DoctorTable from '../components/DoctorTable';

const VolunteerDoctorsPage = () => {
  const authContext = useContext(AuthContext);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [doctorEndpointResponse, setdoctorEndpointResponse] = useState<EndpointResponse | null>(null);
  const [doctorList, setdoctorList] = useState<DoctorResponse[]>([]);
  //console.log(authContext.keycloakToken);
  const limit = 20;
  const offset = 0;

  useEffect(() => {
    if (authContext.isAuthenticated && authContext.keycloakToken && authContext.username) {
      setUsername(authContext.username);
    }
    const fetchEndpointData = async () => {
      try {
        const doctorEndpointData = await fetchEndpointResponse("doctor", limit, offset, authContext, setError);
        console.log(doctorEndpointData);
        setdoctorEndpointResponse(doctorEndpointData);

        const fetchdoctorListData = async () => {
          try {
            const doctorListData = await fetchDoctorList(doctorEndpointData.results, authContext, setError);
            console.log(doctorListData);
            setdoctorList(doctorListData);
          } catch (error) {
            console.error('Error occurred:', error);
            console.error('Logging out...', error);
            authContext.logout();
          }
        };
        fetchdoctorListData();

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
      <h1>Volunteers and Doctors</h1>
      <DoctorTable doctorList={doctorList} />
      {/* Add content specific to doctorss page */}
    </div>
  );
};

export default VolunteerDoctorsPage;
