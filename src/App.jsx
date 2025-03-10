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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import PremiumInput from './components/Inputs/PremiumInput';
import BankInterest from './components/Inputs/BankInterest';
import TermsAndCashValue from './components/Inputs/TermsAndCashValue';
import TermsTable from './components/Inputs/TermsTable';
import ReturnChart from './components/Inputs/ReturnChart';
import Currency from './components/Inputs/Currency';
import LanguageSwitcher from './components/Inputs/LanguageSwitch';
import { useTranslation } from 'react-i18next';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' }, secondary: { main: '#dc004e' } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

const initialState = {
  premiumInput: { premium: 2400000, loanRate: 72, loanAmount: 1728000, firstYearBonus: 120000, principal: 552000, firstDateCashValue: 1920000, bankLoanRatio: 90, firstYearBonusRate: 10 },
  bankInterestInput: { loanInterest: 4, monthlyInterestPayment: 0 },
  termsAndCashValue: { term: [5, 10, 15], cashValue: [2654933, 3672432, 5077716] },
  tableData: {
    totalExpense: [345600, 691200, 1036800],
    netCash: [926933, 1944432, 3349716],
    returnInDollar: [29333, 701232, 1760916],
    returnRate: [5.313949275362319, 127.03478260869565, 319.00652173913045],
  },
  currencySwitch: false,
  undoStack: [],
  redoStack: [],
};

const loadVersionState = (version) => {
  const saved = localStorage.getItem(`state_ver${version}`);
  return saved ? JSON.parse(saved) : initialState;
};

const App = () => {
  const { t, i18n } = useTranslation();
  const [currentVersion, setCurrentVersion] = useState(1);
  const initialVersionState = loadVersionState(currentVersion);

  const [premiumInput, setPremiumInput] = useState(initialVersionState.premiumInput);
  const [bankInterestInput, setBankInterestInput] = useState(initialVersionState.bankInterestInput);
  const [termsAndCashValue, setTermsAndCashValue] = useState(initialVersionState.termsAndCashValue);
  const [tableData, setTableData] = useState(initialVersionState.tableData);
  const [currencySwitch, setCurrencySwitch] = useState(initialVersionState.currencySwitch);
  const [undoStack, setUndoStack] = useState(initialVersionState.undoStack);
  const [redoStack, setRedoStack] = useState(initialVersionState.redoStack);

  // Add appBarColor state, initialized from localStorage or default to 'green'
  const [appBarColor, setAppBarColor] = useState(localStorage.getItem('appBarColor') || 'green');

  // Save appBarColor to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appBarColor', appBarColor);
  }, [appBarColor]);

  useEffect(() => {
    if (!currentVersion) {
      setCurrentVersion(1);
    }
  }, [currentVersion]);

  const getCurrentState = () => ({
    premiumInput,
    bankInterestInput,
    termsAndCashValue,
    tableData,
    currencySwitch,
  });

  const setStateFromObject = (stateObj) => {
    setPremiumInput(stateObj.premiumInput);
    setBankInterestInput(stateObj.bankInterestInput);
    setTermsAndCashValue(stateObj.termsAndCashValue);
    setTableData(stateObj.tableData);
    setCurrencySwitch(stateObj.currencySwitch);
  };

  const handleVersionSwitch = (newVersion) => {
    const currentState = {
      premiumInput,
      bankInterestInput,
      termsAndCashValue,
      tableData,
      currencySwitch,
      undoStack,
      redoStack,
    };
    localStorage.setItem(`state_ver${currentVersion}`, JSON.stringify(currentState));
    const newState = loadVersionState(newVersion);
    setPremiumInput(newState.premiumInput);
    setBankInterestInput(newState.bankInterestInput);
    setTermsAndCashValue(newState.termsAndCashValue);
    setTableData(newState.tableData);
    setCurrencySwitch(newState.currencySwitch);
    setUndoStack(newState.undoStack);
    setRedoStack(newState.redoStack);
    setCurrentVersion(newVersion);
  };

  const resetAllInputs = () => {
    setStateFromObject(initialState);
    setUndoStack([]);
    setRedoStack([]);
    localStorage.setItem(`state_ver${currentVersion}`, JSON.stringify(initialState));
  };

  const saveToUndoStack = () => {
    const currentState = getCurrentState();
    setUndoStack((prev) => [...prev, currentState]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const currentState = getCurrentState();
      setRedoStack((prev) => [...prev, currentState]);
      const lastState = undoStack[undoStack.length - 1];
      setStateFromObject(lastState);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [...prev, getCurrentState()]);
      setStateFromObject(nextState);
      setRedoStack((prev) => prev.slice(0, -1));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: appBarColor }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => {
                window.location.href = "https://portal.aimarketings.io/tool-list/";
              }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('Insurance Financial Loan Calculator')}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="main-app">
        <style>{`
          .main-app { max-width: 1600px; margin: 0 auto; padding: 10px; font-family: 'Segoe UI', sans-serif; }
        `}</style>
        <Grid container spacing={{ xs: 3, md: 2 }}>
          {/* Main Content Column */}
          <Grid item xs={12} sm={8} md={9}>
            <Grid container direction="column" spacing={{ xs: 2, md: 3 }}>
              <Grid item>
                <PremiumInput
                  inputs={premiumInput}
                  setInputs={setPremiumInput}
                  saveToUndoStack={saveToUndoStack}
                  currencySwitch={currencySwitch}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Currency
                  switch={currencySwitch}
                  setInputs={setCurrencySwitch}
                  saveToUndoStack={saveToUndoStack}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
                <BankInterest
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  saveToUndoStack={saveToUndoStack}
                  loanAmount={premiumInput.loanAmount || 0}
                  currencySwitch={currencySwitch}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
                <TermsAndCashValue
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                  saveToUndoStack={saveToUndoStack}
                  currencySwitch={currencySwitch}
                />
              </Grid>
              <Grid item>
                <ReturnChart
                  premiumInput={premiumInput}
                  termsData={termsAndCashValue}
                  tableData={tableData}
                  currencySwitch={currencySwitch}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item>
                <TermsTable
                  termsAndCashValue={termsAndCashValue}
                  premiumInput={premiumInput}
                  bankInterest={bankInterestInput}
                  tableData={tableData}
                  setInputs={setTableData}
                  currencySwitch={currencySwitch}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item>
                <p>{t('disclaimer')}</p>
              </Grid>
              <Grid item sx={{ display: { xs: 'block', sm: 'none' } }}>
                <LanguageSwitcher
                  onReset={resetAllInputs}
                  handleVersionSwitch={handleVersionSwitch}
                  currentVersion={currentVersion}
                  handleUndo={handleUndo}
                  undoStack={undoStack}
                  handleRedo={handleRedo}
                  redoStack={redoStack}
                  setAppBarColor={setAppBarColor} // Pass setAppBarColor
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
            </Grid>
          </Grid>
          {/* Side Column for Tablets and Desktops */}
          <Grid item xs={12} sm={4} md={3} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Currency
                  switch={currencySwitch}
                  setInputs={setCurrencySwitch}
                  saveToUndoStack={saveToUndoStack}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item>
                <BankInterest
                  inputs={bankInterestInput}
                  setInputs={setBankInterestInput}
                  saveToUndoStack={saveToUndoStack}
                  loanAmount={premiumInput.loanAmount || 0}
                  currencySwitch={currencySwitch}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item>
                <TermsAndCashValue
                  inputs={termsAndCashValue}
                  setInputs={setTermsAndCashValue}
                  saveToUndoStack={saveToUndoStack}
                  currencySwitch={currencySwitch}
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
              <Grid item>
                <LanguageSwitcher
                  onReset={resetAllInputs}
                  handleVersionSwitch={handleVersionSwitch}
                  currentVersion={currentVersion}
                  handleUndo={handleUndo}
                  undoStack={undoStack}
                  handleRedo={handleRedo}
                  redoStack={redoStack}
                  setAppBarColor={setAppBarColor} 
                  appBarColor = {appBarColor}// Pass setAppBarColor
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default App;