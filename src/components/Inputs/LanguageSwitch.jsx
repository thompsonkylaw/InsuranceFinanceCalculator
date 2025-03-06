import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Radio, RadioGroup, FormControlLabel, Button, Card, Box, Tooltip, Dialog } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Setting from './Setting'; // Import the new Setting component

function LanguageSwitcher({
  onReset,
  handleVersionSwitch,
  currentVersion,
  handleUndo,
  undoStack,
  handleRedo,
  redoStack,
  setAppBarColor,
  appBarColor, // Add setAppBarColor prop
}) {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
  const [settingsOpen, setSettingsOpen] = useState(false); // State for dialog

  useEffect(() => {
    if (!selectedLanguage) {
      setSelectedLanguage('en');
      i18n.changeLanguage('en');
    }
  }, [selectedLanguage, i18n]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, mt: 2 }}>
      <Grid container spacing={2} direction="column">
        {/* Version Select Buttons */}
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {[1, 2, 3, 4].map((ver) => (
              <Button
                key={ver}
                variant={currentVersion === ver ? 'contained' : 'outlined'}
                onClick={() => handleVersionSwitch(ver)}
                sx={{
                  borderRadius: '16px',
                  minWidth: '60px',
                  padding: '4px 10px',
                  backgroundColor: currentVersion === ver ? appBarColor : 'transparent',
                  color: currentVersion === ver ? 'white' : appBarColor,
                  borderColor: appBarColor,
                  '&:hover': {
                    backgroundColor: currentVersion === ver ? '#1b7e43' : '#e0f2e9',
                  },
                }}
              >
                {t('Ver')} {ver}
              </Button>
            ))}
          </Box>
        </Grid>

        {/* Undo, Redo, and Reset Buttons */}
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button
              variant="contained"
              onClick={onReset}
              sx={{
                backgroundColor: appBarColor,
                color: 'white',
                '&:hover': { backgroundColor: '#1b7e43' },
              }}
            >
              {t('Reset Data')}
            </Button>
            <Tooltip title={t('Undo')}>
              <span>
                <Button
                  variant="contained"
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  sx={{
                    backgroundColor: appBarColor,
                    color: 'white',
                    '&:hover': { backgroundColor: '#1b7e43' },
                  }}
                  aria-label={t('Undo')}
                >
                  <UndoIcon />
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={t('Redo')}>
              <span>
                <Button
                  variant="contained"
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  sx={{
                    backgroundColor: appBarColor,
                    color: 'white',
                    '&:hover': { backgroundColor: '#1b7e43' },
                  }}
                  aria-label={t('Redo')}
                >
                  <RedoIcon />
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Grid>

        {/* Language Radio Buttons */}
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
            <RadioGroup
              row
              aria-label="language"
              name="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              sx={{ flex: 1, display: 'flex', justifyContent: 'space-evenly' }}
            >
              <FormControlLabel
                value="en"
                control={<Radio sx={{ color: appBarColor, '&.Mui-checked': { color: appBarColor } }} />}
                label="English"
              />
              <FormControlLabel
                value="zh-HK"
                control={<Radio sx={{ color: appBarColor, '&.Mui-checked': { color: appBarColor } }} />}
                label="繁體中文"
              />
              <FormControlLabel
                value="zh-CN"
                control={<Radio sx={{ color: appBarColor, '&.Mui-checked': { color: appBarColor } }} />}
                label="简體中文"
              />
            </RadioGroup>
          </Box>
        </Grid>

        {/* Settings Button */}
        <Grid item>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleOpenSettings}>{t('Settings')}</Button>
          </Box>
        </Grid>
      </Grid>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={handleCloseSettings}>
        <Setting setAppBarColor={setAppBarColor} onClose={handleCloseSettings} />
      </Dialog>
    </Card>
  );
}

export default LanguageSwitcher;