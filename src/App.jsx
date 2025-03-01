import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  Grid,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
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
    secondary: { main: '#dc004e' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'visible',
        },
      },
    },
  },
});

const initialPremiumInput = {
  premium: 2400000,
  loanRate: 72,
  loanAmount: 1728000,
  firstYearBonus: 120000,
  principal: 552000,
  firstDateCashValue: 1920000,
  bankLoanRatio: 90,
};

const initialBankInterestInput = {
  loanInterest: 4,
  monthlyInterestPayment: 0,
};

const initialTermsAndCashValue = {
  term: [5, 10, 15],
  cashValue: [2654933, 3672432, 5077716],
};

const initialTableData = {
  totalExpense: [345600, 691200, 1036800],
  netCash: [926933, 1944432, 3349716],
  returnInDollar: [29333, 701232, 1760916],
  returnRate: [5.313949275362319, 127.03478260869565, 319.00652173913045],
};

const App = () => {
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
  const [undoStack, setUndoStack] = useState([]);

  // Function to save the current state to the undo stack
  const saveToUndoStack = () => {
    const currentState = {
      premiumInput,
      bankInterestInput,
      termsAndCashValue,
      currencySwitch,
    };
    setUndoStack((prevStack) => [...prevStack, currentState]);
  };

  // Handle undo action
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setPremiumInput(lastState.premiumInput);
      setBankInterestInput(lastState.bankInterestInput);
      setTermsAndCashValue(lastState.termsAndCashValue);
      setCurrencySwitch(lastState.currencySwitch);
      setUndoStack((prevStack) => prevStack.slice(0, -1));
      // Note: tableData will be recalculated by TermsTable
    }
  };

  // Reset all inputs to initial values
  const resetAllInputs = () => {
    setUndoStack([]); // Clear the undo stack to reset the Undo state
    setPremiumInput(initialPremiumInput);
    setBankInterestInput(initialBankInterestInput);
    setTermsAndCashValue(initialTermsAndCashValue);
    setCurrencySwitch(false);
    // tableData will be recalculated by TermsTable
  };

  // Persist state to localStorage
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: { xs: 1, md: 0 },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <AppBar position="static" sx={{ backgroundColor: '#219a52' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="back">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              保費融資
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={{ xs: 3, md: 2 }}>
          <Grid item xs={12} md={9}>
            <Grid container direction="column" spacing={{ xs: 2, md: 3 }}>
              <Grid item>
                <Box sx={{ width: '100%', overflow: 'hidden' }}>
                  <PremiumInput
                    inputs={premiumInput}
                    setInputs={setPremiumInput}
                    saveToUndoStack={saveToUndoStack}
                    currencySwitch={currencySwitch}
                  />
                </Box>
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <Currency
                  switch={currencySwitch}
                  setInputs={setCurrencySwitch}
                  saveToUndoStack={saveToUndoStack}
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <BankInterest
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  saveToUndoStack={saveToUndoStack}
                  loanAmount={premiumInput.loanAmount || 0}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <TermsAndCashValue
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                  saveToUndoStack={saveToUndoStack}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <ReturnChart
                  premiumInput={premiumInput}
                  termsData={termsAndCashValue}
                  tableData={tableData}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <TermsTable
                  termsAndCashValue={termsAndCashValue}
                  premiumInput={premiumInput}
                  bankInterest={bankInterestInput}
                  tableData={tableData}
                  setInputs={settableData}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item sx={{ width: '100%' }}>
                <p>
                  免責聲明:以上簡化版計算僅供參考用途，一切以各產品條款內容為准 *年化收益
                  僅基於初期本金、最終淨回報及年期計算
                </p>
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <LanguageSwitcher onReset={resetAllInputs} />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
                <Button
                  variant="contained"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                >
                  Undo
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'relative',
            }}
          >
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Currency
                  switch={currencySwitch}
                  setInputs={setCurrencySwitch}
                  saveToUndoStack={saveToUndoStack}
                />
              </Grid>
              <Grid item>
                <BankInterest
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  saveToUndoStack={saveToUndoStack}
                  loanAmount={premiumInput.loanAmount || 0}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item>
                <TermsAndCashValue
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                  saveToUndoStack={saveToUndoStack}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item>
                <LanguageSwitcher onReset={resetAllInputs} />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                >
                  Undo
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;