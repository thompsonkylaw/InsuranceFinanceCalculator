import React from 'react';
import { Box, Card, CardContent, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const PremiumInput = ({ inputs, setInputs }) => {
  // Calculate derived values
  const loanAmount = Math.round((inputs.premium * inputs.loanRate) / 100);
  const calculatedPrincipal = inputs.premium - loanAmount - inputs.firstYearBonus;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(value) ? 0 : value);
  };

  // Handle changes for premium and firstYearBonus
  const handleDirectChange = (field) => (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    
    setInputs(prev => ({
      ...prev,
      [field]: numericValue,
      principal: prev.principal === undefined ? 
        prev.premium - (prev.premium * prev.loanRate)/100 - prev.firstYearBonus :
        prev.principal
    }));
  };

  // Handle loan rate changes
  const handleLoanRateChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = Math.min(100, parseInt(rawValue, 10) || 0);
    
    setInputs(prev => ({
      ...prev,
      loanRate: numericValue,
      principal: prev.premium - (prev.premium * numericValue)/100 - prev.firstYearBonus
    }));
  };

  // Handle principal changes
  const handlePrincipalChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numericValue = parseInt(rawValue, 10) || 0;
    
    // Calculate new loan rate based on principal input
    const newLoanRate = Math.min(100, Math.max(0,((inputs.premium - inputs.firstYearBonus - numericValue) / inputs.premium * 100)));

    setInputs(prev => ({
      ...prev,
      loanRate: newLoanRate,
      principal: numericValue
    }));
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
                label="Premium"
                variant="standard"
                value={formatCurrency(inputs.premium)}
                onChange={handleDirectChange('premium')}
                inputProps={{ 'aria-label': 'Premium input' }}
              />
            </Box>

            {/* Loan Percentage Input */}
            <Box position="relative">
              <IconButton sx={{ position: 'absolute', top: 0, right: 0, p: '5px', zIndex: 1 }}>
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
                onChange={handleLoanRateChange}
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
                onChange={handleDirectChange('firstYearBonus')}
                inputProps={{ 'aria-label': 'First year bonus input' }}
              />
            </Box>

            {/* Principal Input */}
            <Box>
              <TextField
                fullWidth
                label="Principal"
                variant="standard"
                value={formatCurrency(inputs.principal ?? calculatedPrincipal)}
                onChange={handlePrincipalChange}
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