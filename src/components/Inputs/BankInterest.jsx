import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Slider,
  IconButton,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const BankInterest = ({ inputs, setInputs, loanAmount,currencySwitch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localLoanInterest, setLocalLoanInterest] = useState(inputs.loanInterest);

  // Add this effect to sync local state with parent state
  useEffect(() => {
    setLocalLoanInterest(inputs.loanInterest);
  }, [inputs.loanInterest]);

  useEffect(() => {
    const monthlyPayment = (loanAmount * inputs.loanInterest) / 12 / 100;
    setInputs((prev) => ({
      ...prev,
      monthlyInterestPayment: monthlyPayment,
    }));
  }, [loanAmount, inputs.loanInterest, setInputs]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
    const numericValue = rawValue ? parseFloat(rawValue) : 0;
    
    // Update local state immediately for responsive input
    setLocalLoanInterest(numericValue);
    
    // Update parent state with clamped value
    const clampedValue = Math.min(Math.max(numericValue, 0.125), 10);
    updateValues(clampedValue);
  };


  const handleSliderChange = (event, newValue) => {
    updateValues(newValue);
  };

  const updateValues = (interest) => {
    const monthlyPayment = (loanAmount * interest) / 12 / 100;
    setInputs((prev) => ({
      ...prev,
      loanInterest: interest,
      monthlyInterestPayment: monthlyPayment,
    }));
  };

  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="subtitle1" fontWeight="bold">
              Loan Interest
            </Typography>
          </Grid>
          <Grid item>
            <input
              type="text"
              value={`${localLoanInterest}%`}
              onChange={handleInputChange}
              disabled={currencySwitch}
              style={{
                width: '60px',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: currencySwitch ? '#999' : '#1976d2',
                textAlign: 'right',
                cursor: currencySwitch ? 'not-allowed' : 'auto'
              }}
            />
          </Grid>
          
          <Grid item>
          <IconButton
              size="small"
              onClick={(event) => {
                setIsExpanded(!isExpanded);
                event.currentTarget.blur();
              }}
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
                // Remove currencySwitch-related styling
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              <ExpandMoreIcon />
        
            </IconButton>
          </Grid>
        </Grid>

        {/* 展開顯示的內容 */}
        {isExpanded && (
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Monthly Interest: {currencySwitch ? 'HK$' : '$'}
            {(inputs.monthlyInterestPayment * 
              (currencySwitch ? 7.8 : 1)).toFixed(2)}
          </Typography>
        )}

        {/* 滑桿 */}
        <Slider
          value={inputs.loanInterest}
          onChange={handleSliderChange}
          disabled={currencySwitch}
          step={0.125}
          marks
          min={0.125}
          max={10}
          valueLabelDisplay="auto"
          sx={{
            "& .MuiSlider-thumb": {
              borderRadius: "50%",
              border: currencySwitch ? "2px solid #999" : "2px solid blue",
              bgcolor: currencySwitch ? '#fff' : 'blue',
            },
            "& .MuiSlider-track": {
              bgcolor: currencySwitch ? '#999' : "blue",
            },
            "& .MuiSlider-rail": {
              bgcolor: "#d3d3d3",
            },
            "& .Mui-disabled": {
              cursor: 'not-allowed'
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BankInterest;
