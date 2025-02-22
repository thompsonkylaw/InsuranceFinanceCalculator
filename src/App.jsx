import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import PremiumInput from './components/Inputs/PremiumInput';
import BankInterest from './components/Inputs/BankInterest';
import TermsAndCashValue from './components/Inputs/TermsAndCashValue';
import TermsTable from './components/Inputs/TermsTable';

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
  loanAmount: 800000,
  firstYearBonus: 50000,  // Fixed typo (Bouns → Bonus)
  principal: 100000,
  firstDateCashValue: 990000,
  bankLoanRatio:90,
};

const initialBankInterestInput = {
  loanInterest: 4,
  monthlyInterestPayment: 0,
  
};

const initialTermsAndCashValue = {
  term: [5,10,15],
  cashValue: [100000,200000,300000]
};

const App = () => {
  // Move state inside component
  const [premiumInput, setPremiumInput] = useState(() => {
    return initialPremiumInput;
  });  
  const [bankInterestInput, setBankInterestInput] = useState(() => {
      return initialBankInterestInput;  
  });
  const [termsAndCashValue, setTermsAndCashValue] = useState(() => {
    return initialTermsAndCashValue;  
});
  useEffect(() => {
    localStorage.setItem('premiumInput', JSON.stringify(premiumInput));
  }, [premiumInput]);


  
  const combinedInputs = {
    ...premiumInput,
    ...bankInterestInput,
    ...termsAndCashValue,
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
      <div style={{ padding: '16px' }}>
        <BankInterest 
          inputs={bankInterestInput}
          setInputs={setBankInterestInput}
          loanAmount={premiumInput.loadAmount || 0} // Make sure this matches your data structure
        />
      </div>
      <div style={{ padding: '16px' }}>
        <TermsAndCashValue 
          inputs={termsAndCashValue}
          setInputs={setTermsAndCashValue}
          
        />
      </div>

      <div style={{ padding: '16px' }}>
      <TermsTable 
        termsAndCashValue={termsAndCashValue}
        premiumInput={premiumInput}
        BankInterest={bankInterestInput}
       />
      </div>
  
    </ThemeProvider>
  );
};

export default App;