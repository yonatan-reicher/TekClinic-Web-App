'use client';
import MyApp from './MyApp';
import AuthContextProvider from './context/AuthContextProvider';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <AuthContextProvider>
      <MantineProvider>
        <MyApp />
      </MantineProvider>
    </AuthContextProvider>
  )
}

export default App;