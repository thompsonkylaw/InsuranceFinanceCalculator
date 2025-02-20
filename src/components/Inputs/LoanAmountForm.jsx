// LoanAmountForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography
} from '@mui/material';

const LoanAmountForm = ({ open, onClose, premium, initialLoanAmount, onSave }) => {
  const [cashValue, setCashValue] = useState(premium);
  const [loanRatio, setLoanRatio] = useState(90);

  useEffect(() => {
    if (open && premium > 0) {
      const initialRatio = Math.round((initialLoanAmount / premium) * 100);
      setLoanRatio(initialRatio || 0);
      setCashValue(premium);
    }
  }, [open, premium, initialLoanAmount]);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(isNaN(value) ? 0 : value);

  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  const calculateLoanAmount = () => Math.round(cashValue * (loanRatio / 100));

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
              value={`${isNaN(loanRatio) ? 0 : loanRatio}%`}
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