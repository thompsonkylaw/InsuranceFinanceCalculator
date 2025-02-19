// LoanAmountForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography
} from '@mui/material';

const LoanAmountForm = ({ open, onClose, premium, onSave }) => {
  const [cashValue, setCashValue] = useState(premium);
  const [loanRatio, setLoanRatio] = useState(90);

  // Initialize values when premium changes
  useEffect(() => {
    setCashValue(premium);
  }, [premium]);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(isNaN(value) ? 0 : value);

  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  const calculateLoanAmount = () => {
    const cv = parseCurrency(cashValue);
    const lr = parseFloat(loanRatio) || 0;
    return Math.round(cv * (lr / 100));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Loan Ratio Calculator</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="First Date Cash Value"
              value={formatCurrency(cashValue)}
              onChange={(e) => setCashValue(parseCurrency(e.target.value))}
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank Loan Ratio"
              value={`${loanRatio}%`}
              onChange={(e) => {
                const value = Math.min(100, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0);
                setLoanRatio(value);
              }}
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: 'grey', fontSize: '1.1em' }}>
              Loan Amount: {formatCurrency(calculateLoanAmount())}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => {
            onSave(calculateLoanAmount());
            onClose();
          }}
          color="primary"
        >
          Paste
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanAmountForm;