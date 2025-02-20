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
  premium: 1000000,
  loanRate: 80,
  loadAmount: 1782000,
  firstYearBonus: 50000,  // Fixed typo (Bouns → Bonus)
  principal: 100000,
  firstDateCashValue: 990000,
  bankLoanRatio:90
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
  
  const combinedInputs = {
    ...premiumInput,
    //...userInput4,
   // duration: userInput3.toAge - userInput3.fromAge
  };
  console.log("combinedInputs",combinedInputs);
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