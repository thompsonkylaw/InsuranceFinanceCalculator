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

const BankInterest = ({ inputs, setInputs, loanAmount }) => {
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
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, maxWidth: 350 }}>
      <CardContent>
        {/* 貸款利率標題 */}
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
              style={{
                width: '60px',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#1976d2',
                textAlign: 'right'
              }}
            />
          </Grid>
          
          <Grid item>
            <IconButton
              size="small"
              onClick={(event) => {
                setIsExpanded(!isExpanded);
                event.currentTarget.blur(); // 讓按鈕失去焦點
              }}
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Grid>
        </Grid>

        {/* 展開顯示的內容 */}
        {isExpanded && (
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Monthly Interest：${inputs.monthlyInterestPayment.toFixed(2)}
          </Typography>
        )}

        {/* 滑桿 */}
        <Slider
          value={inputs.loanInterest}
          onChange={handleSliderChange}
          step={0.125}
          marks
          min={0.125}
          max={10}
          valueLabelDisplay="auto"
          sx={{
            "& .MuiSlider-thumb": {
              borderRadius: "50%",
              border: "2px solid blue",
            },
            "& .MuiSlider-track": {
              bgcolor: "blue",
            },
            "& .MuiSlider-rail": {
              bgcolor: "#d3d3d3",
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default BankInterest;
