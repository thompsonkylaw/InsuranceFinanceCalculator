import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Grid, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import PremiumInput from './components/Inputs/PremiumInput';
import BankInterest from './components/Inputs/BankInterest';
import TermsAndCashValue from './components/Inputs/TermsAndCashValue';
import TermsTable from './components/Inputs/TermsTable';
import ReturnChart from './components/Inputs/ReturnChart';
import Currency from './components/Inputs/Currency';
import LanguageSwitcher from './components/Inputs/LanguageSwitch';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'visible' // Ensures cards can expand properly
          
        }
      }
    }
  }
});

const initialPremiumInput = {
  premium: 2400000,
  loanRate: 72,
  loanAmount: 1728000,
  firstYearBonus: 120000,  // Fixed typo (Bouns → Bonus)
  principal: 552000,
  firstDateCashValue: 1920000,
  bankLoanRatio:90,
};

const initialBankInterestInput = {
  loanInterest: 4,
  monthlyInterestPayment: 0,
};

const initialTermsAndCashValue = {
  term: [5,10,15],
  cashValue: [2654933,3672432,5077716]
};

const initialTableData = {
  totalExpense: [345600,691200,1036800],
  netCash:[926933,1944432,3349716],
  returnInDollar:[29333,701232,1760916],
  returnRate:[5.313949275362319,127.03478260869565,319.00652173913045],
};




const App = () => {
  // Initialize state with local storage or initial values
  const [premiumInput, setPremiumInput] = useState(() => {
    const saved = localStorage.getItem('premiumInput');
    return saved ? JSON.parse(saved) : initialPremiumInput;
  });
  const [bankInterestInput, setBankInterestInput] = useState(() => {
    const saved = localStorage.getItem('bankInterestInput');
    return saved ? JSON.parse(saved) : initialBankInterestInput;
  });
  const [termsAndCashValue, setTermsAndCashValue] = useState(() => {
    const saved = localStorage.getItem('termsAndCashValue');
    return saved ? JSON.parse(saved) : initialTermsAndCashValue;
  });
  const [tableData, settableData] = useState(() => {
    const saved = localStorage.getItem('tableData');
    return saved ? JSON.parse(saved) : initialTableData;
  });
  const [currencySwitch, setCurrencySwitch] = useState(() => {
    const saved = localStorage.getItem('currencySwitch');
    return saved ? JSON.parse(saved) : false;
  });

  // Save states to local storage on update
  useEffect(() => {
    localStorage.setItem('premiumInput', JSON.stringify(premiumInput));
  }, [premiumInput]);

  useEffect(() => {
    localStorage.setItem('bankInterestInput', JSON.stringify(bankInterestInput));
  }, [bankInterestInput]);

  useEffect(() => {
    localStorage.setItem('termsAndCashValue', JSON.stringify(termsAndCashValue));
  }, [termsAndCashValue]);

  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(tableData));
  }, [tableData]);

  useEffect(() => {
    localStorage.setItem('currencySwitch', JSON.stringify(currencySwitch));
  }, [currencySwitch]);

  // Reset all inputs to initial state
  const resetAllInputs = () => {
    setPremiumInput(initialPremiumInput);
    setBankInterestInput(initialBankInterestInput);
    setTermsAndCashValue(initialTermsAndCashValue);
    settableData(initialTableData);
    setCurrencySwitch(false);

    const combinedInputs = {
      ...premiumInput,
      ...bankInterestInput,
      ...termsAndCashValue,
      ...tableData,
      currencySwitch
     // duration: userInput3.toAge - userInput3.fromAge
    };
    // console.log("combinedInputs",combinedInputs);
  };

  const combinedInputs = {
    ...premiumInput,
    ...bankInterestInput,
    ...termsAndCashValue,
    ...tableData,
    currencySwitch
   // duration: userInput3.toAge - userInput3.fromAge
  };
  // console.log("combinedInputs",combinedInputs);
  
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        p: { xs: 1, md: 3 },
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}>
        <Grid container spacing={{ xs: 0, md: 3 }}> {/* Remove spacing on mobile */}
          {/* Mobile & Desktop Structure */}
          <Grid item xs={12} md={9}>
            <Grid container direction="column" spacing={{ xs: 2, md: 3 }}>
              <Grid item>
                <Box sx={{ width: '100%', overflow: 'hidden' }}>
                  <PremiumInput 
                    inputs={premiumInput}
                    setInputs={setPremiumInput}
                    currencySwitch = {currencySwitch}
                  />
                </Box>
              </Grid>

              {/* Mobile-only components */}
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
              <Currency 
                switch={currencySwitch}
                setInputs={setCurrencySwitch}
              />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <BankInterest 
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  loanAmount={premiumInput.loanAmount || 0}
                  currencySwitch = {currencySwitch}
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <TermsAndCashValue 
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                  currencySwitch = {currencySwitch}
                />
              </Grid>
              
              {/* Chart and Table */}
              <Grid item sx={{ width: '100%' }}>
                <ReturnChart 
                  premiumInput={premiumInput}
                  termsData={termsAndCashValue}
                  tableData={tableData}
                  currencySwitch = {currencySwitch}
                />
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <TermsTable 
                  termsAndCashValue={termsAndCashValue}
                  premiumInput={premiumInput}
                  bankInterest={bankInterestInput}
                  tableData={tableData}
                  setInputs={settableData}
                  currencySwitch = {currencySwitch}
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                  <LanguageSwitcher onReset={resetAllInputs} />
              </Grid>
            </Grid>
          </Grid>

          {/* Desktop-only right column */}
          <Grid item xs={12} md={3} sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'relative'
          }}>
            <Grid container direction="column" spacing={3}>
            <Grid item>
              <Currency 
                switch={currencySwitch}
                setInputs={setCurrencySwitch}
              />
              </Grid>
              <Grid item>
                <BankInterest 
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  loanAmount={premiumInput.loanAmount || 0}
                  currencySwitch = {currencySwitch}
                />
              </Grid>
              <Grid item>
                <TermsAndCashValue 
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                  currencySwitch = {currencySwitch}
                />
              </Grid>
              <Grid item>
                  <LanguageSwitcher onReset={resetAllInputs} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;