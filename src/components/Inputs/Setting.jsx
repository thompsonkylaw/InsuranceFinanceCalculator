import React from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

const Setting = ({ setAppBarColor, onClose }) => {
  const colors = ['green', 'red', 'yellow', 'blue', 'black'];

  const handleColorSelect = (color) => {
    setAppBarColor(color);
    onClose(); // Close the dialog after selection
  };

  return (
    <>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box>
          {colors.map((color) => (
            <Button
              key={color}
              onClick={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                color: color === 'yellow' ? 'black' : 'white', // Improve readability on yellow
                margin: '5px',
                minWidth: '80px',
              }}
            >
              {color}
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </>
  );
};

export default Setting;