import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LoanAmountForm from './LoanAmountForm';
import { useTranslation } from 'react-i18next';

const PremiumInput = ({ inputs, setInputs,currencySwitch }) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedLoanRate, setSavedLoanRate] = useState(inputs.loanRate); // State to store the saved loan rate
  const [isLoanRateZero, setIsLoanRateZero] = useState(false); // State to track if loan rate is toggled to 0%


  const loanAmount = Math.round((inputs.premium * inputs.loanRate) / 100);

  const formatCurrency = (value) => {
    // Convert value based on currency switch
    const convertedValue = currencySwitch ? value * 7.8 : value;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencySwitch ? 'HKD' : 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(convertedValue) ? 0 : convertedValue);
  };


  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  // Generic handler for direct edits
  const handleDirectEdit = (field) => (e) => {
    const numericValue = parseCurrency(e.target.value);
    const newInputs = { ...inputs, [field]: numericValue };

    if (field === 'loanRate') {
      const newLoanAmount = Math.round((newInputs.premium * numericValue) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - newInputs.firstYearBonus;
      newInputs.loadAmount = newLoanAmount;
    } else if (field === 'firstYearBonus') {
      const newLoanAmount = Math.round((newInputs.premium * newInputs.loanRate) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - numericValue;
    } else if (field === 'principal') {
      const newLoanAmount = newInputs.premium - numericValue - newInputs.firstYearBonus;
      newInputs.loanRate = Math.round((newLoanAmount / newInputs.premium) * 100) || 0;
      newInputs.loadAmount = newLoanAmount;
    } else if (field === 'premium') {
      const newLoanAmount = Math.round((numericValue * newInputs.loanRate) / 100);
      newInputs.principal = numericValue - newLoanAmount - newInputs.firstYearBonus;
      newInputs.loadAmount = newLoanAmount;
    }

    setInputs(newInputs);
  };

  // Handler for toggling loan rate between 0% and saved value
  const handleLoanRateToggle = () => {
    if (isLoanRateZero) {
      // Restore the saved loan rate and recalculate principal
      const newLoanAmount = Math.round((inputs.premium * savedLoanRate) / 100);
      const newPrincipal = inputs.premium - newLoanAmount - inputs.firstYearBonus;
      setInputs((prev) => ({
        ...prev,
        loanRate: savedLoanRate,
        principal: newPrincipal,
        loadAmount: newLoanAmount,
      }));
    } else {
      // Save the current loan rate, set it to 0%, and recalculate principal
      setSavedLoanRate(inputs.loanRate);
      const newLoanAmount = Math.round((inputs.premium * 0) / 100); // Loan amount is 0 when loanRate is 0%
      const newPrincipal = inputs.premium - newLoanAmount - inputs.firstYearBonus;
      setInputs((prev) => ({
        ...prev,
        loanRate: 0,
        principal: newPrincipal,
        loadAmount: newLoanAmount,
      }));
    }
    setIsLoanRateZero(!isLoanRateZero); // Toggle the state
  };


  const handleLoanAmountUpdate = ({ loanAmount, cashValue, loanRatio }) => {
    setInputs((prev) => {
      const preciseLoanAmount = Math.round(loanAmount);
      const newLoanRate = prev.premium ? (preciseLoanAmount / prev.premium) * 100 : 0;
      return {
        ...prev,
        loanRate: newLoanRate,
        principal: prev.premium - preciseLoanAmount - prev.firstYearBonus,
        firstDateCashValue: cashValue,
        bankLoanRatio: loanRatio,
        loadAmount: preciseLoanAmount,
      };
    });
    
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
                  // label="Premium"
                  label={t('premium')}
                  variant="standard"
                  value={formatCurrency(inputs.premium)}
                  onChange={handleDirectEdit('premium')}
                  InputProps={{
                    readOnly: currencySwitch,
                  }}
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
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ 
                          p: '2px', 
                          minWidth: 0, 
                          lineHeight: 1,
                          cursor: currencySwitch ? 'not-allowed' : 'pointer'
                        }}
                        onClick={currencySwitch ? undefined : handleLoanRateToggle}
                        disabled={currencySwitch}
                      >
                        Loan %
                      </Button>
                      <span>(Amount)</span>
                    </Box>
                  }
                  variant="standard"
                  value={`${inputs.loanRate}%`}
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
                  label="1st Year Bonus"
                  variant="standard"
                  value={formatCurrency(inputs.firstYearBonus)}
                  onChange={handleDirectEdit('firstYearBonus')}
                  InputProps={{
                    readOnly: currencySwitch,
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
  
              {/* Principal Input */}
              <Box>
                <TextField
                  fullWidth
                  label="Principal"
                  variant="standard"
                  value={formatCurrency(inputs.principal)}
                  onChange={handleDirectEdit('principal')}
                  InputProps={{
                    readOnly: currencySwitch,
                  }}
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
      </Box>
    );
  };

export default PremiumInput;