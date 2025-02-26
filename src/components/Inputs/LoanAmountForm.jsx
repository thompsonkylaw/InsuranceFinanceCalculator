import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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

const LoanAmountForm = ({ open, onClose, firstDateCashValue, bankLoanRatio, onSave }) => {
  const loanRateInputRef = useRef(null); // Rename for clarity
  const { t } = useTranslation();  
  const [cashValue, setCashValue] = useState(firstDateCashValue || 0);
  const [loanRatio, setLoanRatio] = useState(bankLoanRatio || 0);

  useEffect(() => {
    if (open) {
      setCashValue(prev => prev || firstDateCashValue);
      setLoanRatio(prev => prev || bankLoanRatio);
    }
  }, [open, firstDateCashValue, bankLoanRatio]);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(isNaN(value) ? 0 : value);

  const parseCurrency = (value) => parseInt(value.replace(/\D/g, ''), 10) || 0;

  const calculateLoanAmount = () => Math.round(cashValue * (loanRatio / 100));
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('Loan_Ratio_Calculator')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("First_Date_Cash_Value")}
              value={formatCurrency(cashValue)}
              onChange={(e) => setCashValue(parseCurrency(e.target.value))}
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputRef={loanRateInputRef}
              label={t("Bank_Loan_Ratio")}
              value={`${isNaN(loanRatio) ? 0 : loanRatio}%`}
              onFocus={handleFocus}
              onChange={(e) => {
                const value = Math.min(100, parseInt(e.target.value.replace(/\D/g, ''), 10) || 0);
                setLoanRatio(value);
              }}
              inputProps={{ inputMode: 'numeric' }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ color: 'grey', fontSize: '1.1em' }}>
              {t('Loan_Amount')}: {formatCurrency(calculateLoanAmount())}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('Cancel')}</Button>
        <Button 
          onClick={() => {
            onSave({
              loanAmount: calculateLoanAmount(),
              cashValue,
              loanRatio
            });
            onClose();
          }}
          color="primary"
        >
          {t('Paste')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoanAmountForm;
