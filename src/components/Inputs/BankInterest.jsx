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

const BankInterest = ({ inputs, setInputs, loanAmount, currencySwitch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sliderValue, setSliderValue] = useState(inputs.loanInterest); // Local state for slider

  // Sync sliderValue with inputs.loanInterest whenever it changes
  useEffect(() => {
    setSliderValue(inputs.loanInterest);
  }, [inputs.loanInterest]);

  // Update monthly interest payment when loan amount or interest changes
  useEffect(() => {
    const monthlyPayment = (loanAmount * inputs.loanInterest) / 12 / 100;
    setInputs((prev) => ({
      ...prev,
      monthlyInterestPayment: monthlyPayment,
    }));
  }, [loanAmount, inputs.loanInterest, setInputs]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only digits and decimal point
    const numericValue = rawValue ? parseFloat(rawValue) : 0;
    const clampedValue = Math.min(Math.max(numericValue, 0.125), 10); // Clamp between 0.125 and 10
    setInputs((prev) => ({
      ...prev,
      loanInterest: clampedValue,
    }));
  };

  // Handle slider movement (updates local state during drag)
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  // Handle slider release (updates parent state)
  const handleSliderChangeCommitted = (event, newValue) => {
    setInputs((prev) => ({
      ...prev,
      loanInterest: newValue,
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
              value={inputs.loanInterest} // Directly tied to parent state
              onChange={handleInputChange}
              disabled={currencySwitch}
              style={{
                width: "60px",
                border: "none",
                background: "transparent",
                fontSize: "1rem",
                fontWeight: "bold",
                color: currencySwitch ? "#999" : "#1976d2",
                textAlign: "right",
                cursor: currencySwitch ? "not-allowed" : "auto",
              }}
            />
          </Grid>
          <Grid item>
          <Typography variant="subtitle1" fontWeight="bold">
              %
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Grid>
        </Grid>

        {isExpanded && (
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Monthly Interest: {currencySwitch ? "HK$" : "$"}
            {(inputs.monthlyInterestPayment * (currencySwitch ? 7.8 : 1)).toFixed(2)}
          </Typography>
        )}

        <Slider
          value={sliderValue} // Controlled by local state
          onChange={handleSliderChange} // Updates local state during drag
          onChangeCommitted={handleSliderChangeCommitted} // Updates parent state on release
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
              bgcolor: currencySwitch ? "#fff" : "blue",
            },
            "& .MuiSlider-track": {
              bgcolor: currencySwitch ? "#999" : "blue",
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