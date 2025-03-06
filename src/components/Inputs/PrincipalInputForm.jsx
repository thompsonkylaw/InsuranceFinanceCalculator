import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PrincipalInputForm = ({ open, onClose, currentPrincipal, onSave }) => {
  const { t } = useTranslation();

  // Function to format the value as USD currency
  const formatCurrency = (value) => {
    const stringValue = String(value); // Ensure value is a string
    const numericValue = parseFloat(stringValue.replace(/[^0-9.-]+/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(numericValue) ? 0 : numericValue);
  };

  // Function to parse the currency string back to an integer
  const parseCurrency = (value) => {
    const stringValue = String(value); // Ensure value is a string
    const numericValue = parseFloat(stringValue.replace(/[^0-9.-]+/g, ''));
    return isNaN(numericValue) ? 0 : Math.round(numericValue);
  };

  // Initialize state with the formatted current principal
  const [inputValue, setInputValue] = useState(formatCurrency(currentPrincipal));

  // Handle input changes to maintain currency format
  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
    const formattedValue = formatCurrency(rawValue);
    setInputValue(formattedValue);
  };

  // Handle save action
  const handleSave = () => {
    const numericValue = parseCurrency(inputValue);
    if (numericValue !== 0) {
      onSave(numericValue); // Pass the parsed integer value to the parent component
      onClose(); // Close the dialog after saving
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('editPrincipal')}</DialogTitle>
      <DialogContent>
        <TextField
          label={t('Principal')}
          value={inputValue}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Principal input' }}
        />
        <Typography color="error">{t('principalCannotBeZero')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('Cancel')}</Button>
        <Button onClick={handleSave} disabled={parseCurrency(inputValue) === 0}>
          {t('Paste')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrincipalInputForm;