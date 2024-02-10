'use client';
import MyApp from './MyApp';
import AuthContextProvider from './context/AuthContextProvider';

function App() {
  return (
    <AuthContextProvider>
      <MyApp />
    </AuthContextProvider>
  )
}

export default App;