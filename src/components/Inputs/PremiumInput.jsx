import React, { useState, useRef } from 'react';
import { Box, Card, CardContent, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LoanAmountForm from './LoanAmountForm';
import FirstYearBonusRateForm from './FirstYearBonusRateForm';
import PrincipalInputForm from './PrincipalInputForm'; // Import the new component
import { useTranslation } from 'react-i18next';

const PremiumInput = ({ inputs, setInputs, currencySwitch, saveToUndoStack, appBarColor }) => {
  const loanRateInputRef = useRef(null);
  const { t } = useTranslation();
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [principalDialogOpen, setPrincipalDialogOpen] = useState(false); // New state for Principal dialog
  const [savedLoanRate, setSavedLoanRate] = useState(inputs.loanRate);
  const [isLoanRateZero, setIsLoanRateZero] = useState(false);

  // Calculate derived values based on current state
  const loanAmount = Math.round((inputs.premium * inputs.loanRate) / 100);
  const firstYearBonusRate = inputs.premium > 0 ? ((inputs.firstYearBonus / inputs.premium) * 100).toFixed(0) : 0;

  // Format currency based on currencySwitch (USD or HKD)
  const formatCurrency = (value) => {
    const convertedValue = currencySwitch ? value * 7.8 : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencySwitch ? 'HKD' : 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(convertedValue) ? 0 : convertedValue);
  };

  // Parse currency input to integer
  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  // Handle direct edits to input fields
  const handleDirectEdit = (field) => (e) => {
    saveToUndoStack();
    const numericValue = parseCurrency(e.target.value);
    const newInputs = { ...inputs };

    if (field === 'premium') {
      const currentFirstYearBonusRate = inputs.premium > 0 ? (inputs.firstYearBonus / inputs.premium) * 100 : 0;
      newInputs.premium = numericValue;
      newInputs.firstYearBonus = Math.round((numericValue * currentFirstYearBonusRate) / 100);
      const newLoanAmount = Math.round((numericValue * newInputs.loanRate) / 100);
      newInputs.principal = numericValue - newLoanAmount - newInputs.firstYearBonus;
      newInputs.loanAmount = newLoanAmount;
    } else if (field === 'loanRate') {
      newInputs.loanRate = numericValue;
      const newLoanAmount = Math.round((newInputs.premium * numericValue) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - newInputs.firstYearBonus;
      newInputs.loanAmount = newLoanAmount;
    } else if (field === 'firstYearBonus') {
      newInputs.firstYearBonus = numericValue;
      const newLoanAmount = Math.round((newInputs.premium * newInputs.loanRate) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - numericValue;
    }

    setInputs(newInputs);
  };

  // Handle updates from PrincipalInputForm
  const handlePrincipalUpdate = (newPrincipal) => {
    saveToUndoStack();
    const currentLoanRate = inputs.loanRate;
    const currentBonusRate = inputs.premium ? (inputs.firstYearBonus / inputs.premium) * 100 : 0;
    const denominator = 1 - (currentLoanRate / 100) - (currentBonusRate / 100);
    const newPremium = denominator !== 0 ? Math.round(newPrincipal / denominator) : inputs.premium;
    const newFirstYearBonus = Math.round((newPremium * currentBonusRate) / 100);
    const newLoanAmount = Math.round((newPremium * currentLoanRate) / 100);

    setInputs((prev) => ({
      ...prev,
      premium: newPremium,
      firstYearBonus: newFirstYearBonus,
      principal: newPrincipal,
      loanAmount: newLoanAmount,
    }));
    setPrincipalDialogOpen(false);
  };

  // Toggle loan rate between zero and saved value
  const handleLoanRateToggle = () => {
    saveToUndoStack();
    if (isLoanRateZero) {
      const newLoanAmount = Math.round((inputs.premium * savedLoanRate) / 100);
      const newPrincipal = inputs.premium - newLoanAmount - inputs.firstYearBonus;
      setInputs((prev) => ({
        ...prev,
        loanRate: savedLoanRate,
        principal: newPrincipal,
        loanAmount: newLoanAmount,
      }));
    } else {
      setSavedLoanRate(inputs.loanRate);
      const newLoanAmount = Math.round((inputs.premium * 0) / 100);
      const newPrincipal = inputs.premium - newLoanAmount - inputs.firstYearBonus;
      setInputs((prev) => ({
        ...prev,
        loanRate: 0,
        principal: newPrincipal,
        loanAmount: newLoanAmount,
      }));
    }
    setIsLoanRateZero(!isLoanRateZero);
  };

  // Handle updates from LoanAmountForm dialog
  const handleLoanAmountUpdate = ({ loanAmount, cashValue, loanRatio }) => {
    saveToUndoStack();
    setInputs((prev) => {
      const preciseLoanAmount = Math.round(loanAmount);
      const newLoanRate = prev.premium ? (preciseLoanAmount / prev.premium) * 100 : 0;
      return {
        ...prev,
        loanRate: newLoanRate,
        principal: prev.premium - preciseLoanAmount - prev.firstYearBonus,
        firstDateCashValue: cashValue,
        bankLoanRatio: loanRatio,
        loanAmount: preciseLoanAmount,
      };
    });
    setLoanDialogOpen(false);
  };

  // Handle updates from FirstYearBonusRateForm dialog
  const handleBonusRateUpdate = (newRate) => {
    saveToUndoStack();
    const newFirstYearBonus = Math.round((inputs.premium * newRate) / 100);
    const newLoanAmount = Math.round((inputs.premium * inputs.loanRate) / 100);
    const newPrincipal = inputs.premium - newLoanAmount - newFirstYearBonus;
    setInputs((prev) => ({
      ...prev,
      firstYearBonus: newFirstYearBonus,
      principal: newPrincipal,
    }));
    setBonusDialogOpen(false);
  };

  // Set cursor position for loan rate input
  const handleFocus = () => {
    setTimeout(() => {
      const input = loanRateInputRef.current;
      if (input) {
        const value = input.value;
        const position = value.length - 1;
        input.setSelectionRange(position, position);
      }
    }, 0);
  };

  return (
    <Box display="grid" gap={1}>
      <Card elevation={1}>
        <CardContent>
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' } }}>
            {/* Premium Input */}
            <Box>
              <TextField
                fullWidth
                label={t('premium')}
                variant="standard"
                value={formatCurrency(inputs.premium)}
                onChange={handleDirectEdit('premium')}
                InputLabelProps={{
                  sx: { fontSize: '22px', fontWeight: 'bold' },
                }}
                InputProps={{ readOnly: currencySwitch }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                    opacity: 1,
                  },
                }}
                inputProps={{ 'aria-label': 'Premium input' }}
              />
            </Box>

            {/* Loan Percentage Input */}
            <Box position="relative">
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  p: '5px',
                  zIndex: 1,
                  cursor: currencySwitch ? 'not-allowed' : 'pointer',
                }}
                onClick={(event) => {
                  if (!currencySwitch) {
                    setLoanDialogOpen(true);
                    event.currentTarget.blur();
                  }
                }}
                disabled={currencySwitch}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <TextField
                fullWidth
                InputLabelProps={{
                  sx: { fontSize: '22px', fontWeight: 'bold' },
                }}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '21px',
                        p: '2px',
                        minWidth: 0,
                        lineHeight: 1,
                        cursor: currencySwitch ? 'not-allowed' : 'pointer',
                        color: appBarColor,
                        borderColor: appBarColor,
                        '&:hover': {
                          borderColor: '#197a43',
                          backgroundColor: '#e6f4ec',
                        },
                        '&.Mui-disabled': {
                          color: '#a0a0a0',
                          borderColor: '#a0a0a0',
                        },
                      }}
                      onClick={currencySwitch ? undefined : handleLoanRateToggle}
                      disabled={currencySwitch}
                    >
                      {t('loan')}
                    </Button>
                    <span>({t('Amount')})</span>
                  </Box>
                }
                inputRef={loanRateInputRef}
                variant="standard"
                value={`${inputs.loanRate.toFixed(0)}%`}
                onFocus={handleFocus}
                onChange={handleDirectEdit('loanRate')}
                InputProps={{
                  readOnly: currencySwitch,
                  endAdornment: (
                    <InputAdornment position="end">
                      ({formatCurrency(loanAmount)})
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                    opacity: 1,
                  },
                }}
                inputProps={{ 'aria-label': 'Loan percentage input' }}
              />
            </Box>

            {/* 1st Year Bonus Input */}
            <Box position="relative">
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  p: '5px',
                  zIndex: 1,
                  cursor: currencySwitch ? 'not-allowed' : 'pointer',
                }}
                onClick={(event) => {
                  if (!currencySwitch) {
                    setBonusDialogOpen(true);
                    event.currentTarget.blur();
                  }
                }}
                disabled={currencySwitch}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <TextField
                fullWidth
                label={t("First_Year_Bonus")}
                variant="standard"
                value={formatCurrency(inputs.firstYearBonus)}
                onChange={handleDirectEdit('firstYearBonus')}
                InputLabelProps={{
                  sx: { fontSize: '22px', fontWeight: 'bold' },
                }}
                InputProps={{
                  readOnly: currencySwitch,
                  endAdornment: (
                    <InputAdornment position="end">
                      ({firstYearBonusRate}%)
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                    opacity: 1,
                  },
                }}
                inputProps={{ 'aria-label': 'First year bonus input' }}
              />
            </Box>

            {/* Principal Input with Edit Icon */}
            <Box position="relative">
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  p: '5px',
                  zIndex: 1,
                  cursor: currencySwitch ? 'not-allowed' : 'pointer',
                }}
                onClick={(event) => {
                  if (!currencySwitch) {
                    setPrincipalDialogOpen(true);
                    event.currentTarget.blur();
                  }
                }}
                disabled={currencySwitch}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <TextField
                fullWidth
                label={t("Principal")}
                variant="standard"
                value={formatCurrency(inputs.principal)}
                InputLabelProps={{
                  sx: { fontSize: '22px', fontWeight: 'bold' },
                }}
                InputProps={{ readOnly: true }} // Always read-only
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                    opacity: 1,
                  },
                }}
                inputProps={{ 'aria-label': 'Principal input' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Loan Amount Form Dialog */}
      {loanDialogOpen && (
        <LoanAmountForm
          open={loanDialogOpen}
          onClose={() => setLoanDialogOpen(false)}
          firstDateCashValue={inputs.firstDateCashValue || 0}
          bankLoanRatio={inputs.bankLoanRatio || 0}
          onSave={handleLoanAmountUpdate}
        />
      )}

      {/* First Year Bonus Rate Form Dialog */}
      {bonusDialogOpen && (
        <FirstYearBonusRateForm
          open={bonusDialogOpen}
          onClose={() => setBonusDialogOpen(false)}
          currentRate={firstYearBonusRate}
          onSave={handleBonusRateUpdate}
        />
      )}

      {/* Principal Input Form Dialog */}
      {principalDialogOpen && (
        <PrincipalInputForm
          open={principalDialogOpen}
          onClose={() => setPrincipalDialogOpen(false)}
          currentPrincipal={inputs.principal}
          onSave={handlePrincipalUpdate}
        />
      )}
    </Box>
  );
};

export default PremiumInput;