import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Grid, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import PremiumInput from './components/Inputs/PremiumInput';
import BankInterest from './components/Inputs/BankInterest';
import TermsAndCashValue from './components/Inputs/TermsAndCashValue';
import TermsTable from './components/Inputs/TermsTable';
import ReturnChart from './components/Inputs/ReturnChart';

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
  totalExpense: [346000,691000,1040000],
  netCash:[927000,1940000,3350000],
  returnInDollar:[293000,701000,1761000],
  returnRate:[5.31,127.03,319.01],
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
  const [tableData, settableData] = useState(() => {
    return initialTableData;  
  });


  useEffect(() => {
    localStorage.setItem('premiumInput', JSON.stringify(premiumInput));
  }, [premiumInput]);


  
  const combinedInputs = {
    ...premiumInput,
    ...bankInterestInput,
    ...termsAndCashValue,
    ...tableData,
   // duration: userInput3.toAge - userInput3.fromAge
  };
  console.log("combinedInputs",combinedInputs);
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
                  />
                </Box>
              </Grid>

              {/* Mobile-only components */}
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <BankInterest 
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  loanAmount={premiumInput.loanAmount || 0}
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <TermsAndCashValue 
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                />
              </Grid>

              {/* Chart and Table */}
              <Grid item sx={{ width: '100%' }}>
                <ReturnChart 
                  premiumInput={premiumInput}
                  termsData={termsAndCashValue}
                  tableData={tableData}
                />
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <TermsTable 
                  termsAndCashValue={termsAndCashValue}
                  premiumInput={premiumInput}
                  bankInterest={bankInterestInput}
                  tableData={tableData}
                  setInputs={settableData}
                />
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
                <BankInterest 
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  loanAmount={premiumInput.loanAmount || 0}
                />
              </Grid>
              <Grid item>
                <TermsAndCashValue 
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;