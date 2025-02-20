// PremiumInput.jsx
import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LoanAmountForm from './LoanAmountForm';

const PremiumInput = ({ inputs, setInputs }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const loanAmount = Math.round((inputs.premium * inputs.loanRate) / 100);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(isNaN(value) ? 0 : value);

  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  // Generic handler for direct edits
  const handleDirectEdit = (field) => (e) => {
    const numericValue = parseCurrency(e.target.value);
    const newInputs = { ...inputs, [field]: numericValue };
  
    if (field === 'loanRate') {
      // Correct formula: Principal = Premium - Loan Amount - First Year Bonus
      const newLoanAmount = Math.round((newInputs.premium * numericValue) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - newInputs.firstYearBonus;
    } 
    else if (field === 'firstYearBonus') {
      // Correct formula: Principal = Premium - Loan Amount - First Year Bonus
      const newLoanAmount = Math.round((newInputs.premium * newInputs.loanRate) / 100);
      newInputs.principal = newInputs.premium - newLoanAmount - numericValue;
    } 
    else if (field === 'principal') {
      // Correct formula: Loan Amount = Premium - Principal - First Year Bonus
      const newLoanAmount = newInputs.premium - numericValue - newInputs.firstYearBonus;
      newInputs.loanRate = Math.round((newLoanAmount / newInputs.premium) * 100) || 0;
    } 
    else if (field === 'premium') {
      // Correct formula: Loan Amount and Principal should be recalculated
      const newLoanAmount = Math.round((numericValue * newInputs.loanRate) / 100);
      newInputs.principal = numericValue - newLoanAmount - newInputs.firstYearBonus;
    }
  
    setInputs(newInputs);
  };
  

  const handleLoanAmountUpdate = (newLoanAmount) => {
    const newLoanRate = Math.round((newLoanAmount / inputs.premium) * 100) || 0;
    setInputs(prev => ({
      ...prev,
      loanRate: newLoanRate,
      principal: prev.premium - newLoanAmount - prev.firstYearBonus
    }));
  };

  return (
    <Box display="grid" gap={1}>
      <LoanAmountForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        premium={inputs.firstDateCashValue}
        initialLoanAmount={loanAmount}
        onSave={handleLoanAmountUpdate}
      />

      <Card elevation={1}>
        <CardContent>
          <Box display="grid" gap={1} sx={{ gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' } }}>
            {/* Premium Input */}
            <Box>
              <TextField
                fullWidth
                label="Premium"
                variant="standard"
                value={formatCurrency(inputs.premium)}
                onChange={handleDirectEdit('premium')}
                inputProps={{ 'aria-label': 'Premium input' }}
              />
            </Box>

            {/* Loan Percentage Input */}
            <Box position="relative">
              <IconButton 
                sx={{ position: 'absolute', top: 0, right: 0, p: '5px', zIndex: 1 }}
                onClick={() => setDialogOpen(true)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <TextField
                fullWidth
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Button variant="outlined" size="small" sx={{ p: '2px', minWidth: 0, lineHeight: 1 }}>
                      Loan %
                    </Button>
                    <span>(Amount)</span>
                  </Box>
                }
                variant="standard"
                value={`${inputs.loanRate}%`}
                onChange={handleDirectEdit('loanRate')}
                inputProps={{ 'aria-label': 'Loan percentage input' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      ({formatCurrency(loanAmount)})
                    </InputAdornment>
                  ),
                }}
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