import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Radio, RadioGroup, FormControlLabel, Button,Card } from '@mui/material';

function LanguageSwitcher({ onReset }) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, mt: 2 }}>
    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
      {/* Language Radio Buttons */}
      <Grid item>
        <RadioGroup
          row
          aria-label="language"
          name="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <FormControlLabel
            value="en"
            control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
            label="English"
            sx={{
            //   backgroundColor: selectedLanguage === 'en' ? 'primary.light' : 'transparent',
            //   borderRadius: '20px',
              padding: '5px 10px',
            //   boxShadow: selectedLanguage === 'en' ? 2 : 0,
            }}
          />
          <FormControlLabel
            value="zh-HK"
            control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
            label="繁體中文"
            sx={{
            //   backgroundColor: selectedLanguage === 'zh_HK' ? 'primary.light' : 'transparent',
            //   borderRadius: '20px',
              padding: '5px 10px',
            //   boxShadow: selectedLanguage === 'zh_HK' ? 2 : 0,
            }}
          />
          <FormControlLabel
            value="zh-CN"
            control={<Radio sx={{ color: 'primary.main', '&.Mui-checked': { color: 'primary.main' } }} />}
            label="简體中文"
            sx={{
            //   backgroundColor: selectedLanguage === 'zh_CN' ? 'primary.light' : 'transparent',
            //   borderRadius: '20px',
              padding: '5px 10px',
            //   boxShadow: selectedLanguage === 'zh_CN' ? 2 : 0,
            }}
          />
        </RadioGroup>
      </Grid>
      {/* Save Data Button */}
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onReset} 
          sx={{ borderRadius: '20px', boxShadow: 2 }}
        >
          {t('Reset Data')}
        </Button>
      </Grid>
    </Grid>
    </Card>
  );
}

export default LanguageSwitcher;