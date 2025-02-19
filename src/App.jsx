import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PremiumInput from './components/Inputs/PremiumInput';

// Create theme outside component
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const initialPremiumInput = {
  premium: 2400000,
  loanRate: 72,
  loadAmount: 1782000,
  firstYearBonus: 120000,  // Fixed typo (Bouns → Bonus)
  principal: 552000
};

const App = () => {
  // Move state inside component
  const [premiumInput, setPremiumInput] = useState(() => {
    return initialPremiumInput;
    // try {
    //   const saved = localStorage.getItem('premiumInput');
    //   return saved ? JSON.parse(saved) : initialPremiumInput;
    // } catch {
    //   return initialPremiumInput;
    // }
  });

  useEffect(() => {
    localStorage.setItem('premiumInput', JSON.stringify(premiumInput));
  }, [premiumInput]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '16px' }}>
        <PremiumInput 
          inputs={premiumInput}
          setInputs={setPremiumInput}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;