import React from 'react';
import { Grid, TextField, MenuItem, Card, CardContent, Typography } from '@mui/material';

const TermsAndCashValue = ({ inputs, setInputs }) => {
  // Ensure we have valid arrays (handle undefined/null cases)
  const terms = inputs?.term || [];
  const cashValues = inputs?.cashValue || [];

  // Create year options from 1 to 20
  const yearOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  // Enhanced currency formatting with better validation
  const formatCurrency = (value) => {
    const numericValue = Number(value) || 0;
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(numericValue);
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
          Terms & Cash Values
        </Typography>
        
        {terms.map((term, index) => {
          // Ensure cashValues array has proper entries
          const cashValue = index < cashValues.length ? cashValues[index] : 0;
          
          return (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label={`Term ${index + 1}`}
                  value={term}
                  onChange={handleTermChange(index)}
                  variant="outlined"
                >
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year} years
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={`Cash Value ${index + 1}`}
                  value={formatCurrency(cashValue)}
                  onChange={handleCashValueChange(index)}
                  variant="outlined"
                  inputProps={{
                    'aria-label': `Cash Value ${index + 1} input`
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