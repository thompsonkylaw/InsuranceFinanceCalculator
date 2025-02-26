import React from 'react';
import { Grid, TextField, MenuItem, Card, CardContent, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TermsAndCashValue = ({ inputs, setInputs,currencySwitch }) => {
  const { t } = useTranslation();
  // Ensure we have valid arrays (handle undefined/null cases)
  const terms = inputs?.term || [];
  const cashValues = inputs?.cashValue || [];

  // Create year options from 1 to 20
  const yearOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  // Enhanced currency formatting with better validation
  const formatCurrency = (value) => {
    // Convert value based on currency switch
    const convertedValue = currencySwitch ? value * 7.8 : value;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencySwitch ? 'HKD' : 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(convertedValue) ? 0 : convertedValue);
  };

  // Safer currency parsing
  const parseCurrency = (value) => {
    const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Handle term changes with array bounds checking
  const handleTermChange = (index) => (e) => {
    const newTerms = [...terms];
    if (index >= 0 && index < newTerms.length) {
      newTerms[index] = parseInt(e.target.value, 10) || 0;
      setInputs({ ...inputs, term: newTerms });
    }
  };

  // Handle cash value changes with array bounds checking
  const handleCashValueChange = (index) => (e) => {
    const newCashValues = [...cashValues];
    if (index >= 0 && index < newCashValues.length) {
      newCashValues[index] = parseCurrency(e.target.value);
      setInputs({ ...inputs, cashValue: newCashValues });
    }
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, mt: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {t('Terms_Cash_Values')}
      </Typography>
      
      {terms.map((term, index) => {
        const cashValue = index < cashValues.length ? cashValues[index] : 0;
          
          return (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={`${t('Term')} ${index + 1}`}
                value={term}
                onChange={handleTermChange(index)}
                variant="outlined"
                InputProps={{
                  readOnly: currencySwitch,
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                    opacity: 1,
                  },
                }}
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year} {t('years')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
              
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`${t('Cash_Value')} ${index + 1}`}
                value={formatCurrency(cashValue)}
                onChange={handleCashValueChange(index)}
                variant="outlined"
                InputProps={{
                  readOnly: currencySwitch,
                  'aria-label': `Cash Value ${index + 1} input`,
                }}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'inherit',
                    opacity: 1,
                  },
                }}
              />
            </Grid>
          </Grid>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TermsAndCashValue;