import React, { useState , useRef } from 'react';
import { Box, Card, CardContent, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LoanAmountForm from './LoanAmountForm'; // Ensure this path matches your project structure
import { useTranslation } from 'react-i18next';

const PremiumInput = ({ inputs, setInputs, currencySwitch,saveToUndoStack }) => {
  const loanRateInputRef = useRef(null); // Rename for clarity
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedLoanRate, setSavedLoanRate] = useState(inputs.loanRate);
  const [isLoanRateZero, setIsLoanRateZero] = useState(false);

  const loanAmount = Math.round((inputs.premium * inputs.loanRate) / 100);

  const formatCurrency = (value) => {
    const convertedValue = currencySwitch ? value * 7.8 : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencySwitch ? 'HKD' : 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(convertedValue) ? 0 : convertedValue);
  };

  // const parseCurrency = (value) => parseFloat(value.replace(/[^0-9.]/g, ''));
  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  const handleDirectEdit = (field) => (e) => {
    saveToUndoStack(); // Save state before update
    const numericValue = parseCurrency(e.target.value);
    const newInputs = { ...inputs, [field]: numericValue };

    if (field === 'loanRate') {
      const newLoanAmount = Math.round((newInputs.premium * numericValue) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - newInputs.firstYearBonus;
      newInputs.loanAmount = newLoanAmount;
    } else if (field === 'firstYearBonus') {
      const newLoanAmount = Math.round((newInputs.premium * newInputs.loanRate) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - numericValue;
    } else if (field === 'principal') {
      const newLoanAmount = newInputs.premium - numericValue - newInputs.firstYearBonus;
      newInputs.loanRate = Math.round((newLoanAmount / newInputs.premium) * 100) || 0;
      newInputs.loanAmount = newLoanAmount;
    } else if (field === 'premium') {
      const newLoanAmount = Math.round((numericValue * newInputs.loanRate) / 100);
      newInputs.principal = numericValue - newLoanAmount - newInputs.firstYearBonus;
      newInputs.loanAmount = newLoanAmount;
    }

    setInputs(newInputs);
  };

  const handleLoanRateToggle = () => {
    saveToUndoStack(); // Save state before update
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

  const handleLoanAmountUpdate = ({ loanAmount, cashValue, loanRatio }) => {
    saveToUndoStack(); // Save state before update
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
    setDialogOpen(false); // Close dialog after saving
  };

  const handleFocus = () => {
    setTimeout(() => {
      const input = loanRateInputRef.current;
      if (input) {
        const value = input.value; // Get the current input value (e.g., "5.00%")
        const position = value.length - 1; // Position before '%'
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
                  cursor: currencySwitch ? 'not-allowed' : 'pointer'
                }}
                onClick={(event) => {
                  if (!currencySwitch) {
                    setDialogOpen(true);
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
    color: '#219a52', // Text color
    borderColor: '#219a52', // Border color
    '&:hover': {
      borderColor: '#197a43', // Darker shade for hover state
      backgroundColor: '#e6f4ec', // Light green background on hover
    },
    '&.Mui-disabled': {
      color: '#a0a0a0', // Grey text for disabled state
      borderColor: '#a0a0a0', // Grey border for disabled state
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
                
                inputRef={loanRateInputRef} // Use inputRef instead of ref
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
            <Box>
              <TextField
                fullWidth
                label={t("First_Year_Bonus")}
                variant="standard"
                value={formatCurrency(inputs.firstYearBonus)}
                onChange={handleDirectEdit('firstYearBonus')}
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
                inputProps={{ 'aria-label': 'First year bonus input' }}
              />
            </Box>

            {/* Principal Input */}
            <Box>
              <TextField
                fullWidth
                label={t("Principal")}
                variant="standard"
                value={formatCurrency(inputs.principal)}
                onChange={handleDirectEdit('principal')}
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
                inputProps={{ 'aria-label': 'Principal input' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Render LoanAmountForm conditionally */}
      {dialogOpen && (
        <LoanAmountForm
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          firstDateCashValue={inputs.firstDateCashValue || 0}
          bankLoanRatio={inputs.bankLoanRatio || 0}
          onSave={handleLoanAmountUpdate}
        />
      )}
    </Box>
  );
};

export default PremiumInput;