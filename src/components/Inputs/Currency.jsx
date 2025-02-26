// Currency.jsx
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

const Currency = ({ switch: isHkd, setInputs }) => {
  const { t } = useTranslation();  
  const handleChange = (event) => {
    // console.log('event.target.checked',event.target.checked);
    // Update parent state with new switch value
    setInputs(event.target.checked);
  };

  return (
    <Grid item xs={12}>
      
      <Card sx={{ p: 1, borderRadius: 3, boxShadow: 3, mt: 2 }}>
        <div style={{ paddingTop: 0, paddingLeft:25, background: '#FFFBF5' }}>
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
                        color="primary"
                      />
                    }
                    label={
                      <Grid container alignItems="center" spacing={1} style={{ lineHeight: 1 }}>
                        {/* <Grid item>
                          <div style={{
                            border: '1px solid #FFC000',
                            color: '#FFC000',
                            padding: 1,
                            borderRadius: 3,
                            fontSize: 12
                          }}>
                            COT
                          </div>
                        </Grid> */}
                        <Grid item>
                          <Typography variant="body1" color="textSecondary" style={{ fontSize: 14 }}>
                            {t('Display_Currency')}: {isHkd ? 'HKD' : 'USD'}
                          </Typography>
                        </Grid>
                      </Grid>
                    }
                    style={{ marginBottom: 0 }}
                  />
                </Grid>
                {/* <Grid item>
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Card>
    </Grid>
  );
};

export default Currency;