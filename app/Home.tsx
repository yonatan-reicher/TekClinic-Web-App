import { useContext } from "react";
import { AuthContext } from "./context/AuthContextProvider";
import Image from "next/image";
import axios, { AxiosResponse, AxiosError } from 'axios';
import { createContext, useEffect, useState } from "react";


interface PatientResponse {
  user_id: string;
  username: string;
  // Add any other properties you expect in the response
}

export default function Home() {
  const authContext = useContext(AuthContext);
  const [patientUsername, setPatientUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  //console.log(authContext.keycloakToken);

  useEffect(() => {
    // Check if the user is authenticated before making the request
    if (authContext.isAuthenticated && authContext.keycloakToken) {
      // Send GET request to localhost:8080/patients/me with the obtained token
      axios.get<PatientResponse>('http://api.tekclinic.org/patients/me', {
        headers: {
          Authorization: `Bearer ${authContext.keycloakToken}`,
        },
      })
      .then((response: AxiosResponse<PatientResponse>) => {
        // Handle the success response
        console.log('GET patients/me Response:', response.data);
        setPatientUsername(response.data.username);
        setError(null); // Reset the error state on success
      })
      .catch((error: AxiosError) => {
        // Handle errors
        console.error('Error fetching patient data:', error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error: ${(error.response.status as number)} - ${(error.response.data as { error: string }).error}`);
        } else if (error.request) {
          // The request was made but no response was received
          setError('No response received from the server.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${error.message}`);
        }
      });
    }
  }, [authContext.isAuthenticated, authContext.keycloakToken]);


  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center mb-12">
          {error ? (
            // Display the error message
            <p className="text-red-500 mb-4">{error}</p>
          ) : (
            // Display the username if no error
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Hello, {patientUsername}
            </h1>
          )}
          {authContext.hasRole("user") && <p>You are a user</p>}
          {authContext.hasRole("admin") && <p>You are an admin</p>}
          <button
            className="text-white bg-red-400 border-0 py-2 px-8 focus:outline-none hover:bg-red-400 rounded text-lg mt-10"
            onClick={authContext.logout}
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}