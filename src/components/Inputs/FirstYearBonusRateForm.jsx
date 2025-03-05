import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const FirstYearBonusRateForm = ({ open, onClose, currentRate, onSave }) => {
  const rateInputRef = useRef(null);
  const { t } = useTranslation();
  const [bonusRate, setBonusRate] = useState(currentRate || 0);

  useEffect(() => {
    if (open) {
      setBonusRate(currentRate);
    }
  }, [open, currentRate]);

  const handleFocus = () => {
    setTimeout(() => {
      const input = rateInputRef.current;
      if (input) {
        const value = input.value;
        const position = value.length - 1;
        input.setSelectionRange(position, position);
      }
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('First_Year_Bonus_Rate')}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          inputRef={rateInputRef}
          label={t("Bonus_Rate")}
          value={`${isNaN(bonusRate) ? 0 : bonusRate}%`}
          onFocus={handleFocus}
          onChange={(e) => {
            const value = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
            setBonusRate(value);
          }}
          inputProps={{ inputMode: 'numeric' }}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('Cancel')}</Button>
        <Button
          onClick={() => {
            onSave(bonusRate);
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

export default FirstYearBonusRateForm;