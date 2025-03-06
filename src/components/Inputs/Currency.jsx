import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Card,
  FormControlLabel,
  Switch,
  Typography,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock'; // Added LockIcon import

const Currency = ({ switch: isHkd, setInputs,appBarColor }) => {
  const { t } = useTranslation();  
  const handleChange = (event) => {
    setInputs(event.target.checked);
  };

  // Conditionally set the background color
  const backgroundColor = isHkd ?  '#FFFBF5' : '#FFFBF5';

  return (
    <Grid item xs={12}>
      <Card sx={{ p: 1, borderRadius: 3, boxShadow: 3, mt: 2 }}>
        <div style={{ paddingTop: 0, paddingLeft: 25, background: backgroundColor,borderRadius: 30, color: 'Red' }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isHkd}
                        onChange={handleChange}
                        name="isCurrencyEnabled"
                        sx={{  // Custom styles for switch
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: appBarColor,  // Thumb color when checked
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: appBarColor,  // Track color when checked
                          },
                          '& .MuiSwitch-switchBase': {
                            color: '#ccc',  // Thumb color when unchecked
                          },
                          '& .MuiSwitch-track': {
                            backgroundColor: '#aaa',  // Track color when unchecked
                          },
                        }}
                      />
                    }
                    label={
                      <Grid container alignItems="center" spacing={1} style={{ lineHeight: 1 }}>
                        <Grid item>
                          <Typography variant="body1" color="textSecondary" style={{ fontSize: 18, fontWeight: 'bold' }}>
                            {t('Display_Currency')}: {isHkd ? 'HKD' : 'USD'}
                          </Typography>
                        </Grid>
                        {/* Add lock icon when HKD is selected */}
                        {isHkd && (
                          <Grid item>
                            <LockIcon fontSize="small" />
                          </Grid>
                        )}
                      </Grid>
                    }
                    style={{ marginBottom: 0 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Card>
    </Grid>
  );
};

export default Currency;