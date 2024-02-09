'use client';
import { useContext } from 'react';
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner"
import Home from "./Home"
import AuthContextProvider from './context/AuthContextProvider';

function App() {
  //const authContext = useContext(AuthContext);
  
  // Show the loading spinner while the user is not authenticated
  if (true) {
    return <LoadingSpinner />;
  }
  // If the user is authenticated display the home component
  else {
    return <Home />;
  }
}

export default App;