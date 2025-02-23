import React, { useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Select,
  MenuItem,
  InputBase
} from '@mui/material';
import { Edit, Info, ExpandMore } from '@mui/icons-material';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const ReturnChart = ({ termsData, premiumInput, tableData }) => {
  const [viewMode, setViewMode] = React.useState('Return Detail');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const colors = {
    Principal: 'rgb(57, 102, 248)',
    LoanAmount: 'rgb(102, 94, 255)',
    TotalExpense: 'rgb(255, 192, 0)',
    Return: 'rgb(15, 175, 63)'
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const labels = ['Year 0', ...termsData.term.map(t => `Year ${t}`)];
      const chartData = {
        labels,
        datasets: [
          {
            label: 'Principal',
            data: [premiumInput.principal, ...termsData.term.map(() => premiumInput.principal)],
            backgroundColor: colors.Principal,
            stack: 'Stack 0'
          },
          {
            label: 'Loan Amount',
            data: [premiumInput.loanAmount, ...termsData.term.map(() => premiumInput.loanAmount)],
            backgroundColor: colors.LoanAmount,
            stack: 'Stack 0'
          },
          {
            label: 'Total Expense',
            data: [0, ...tableData.totalExpense],
            backgroundColor: colors.TotalExpense,
            stack: 'Stack 0'
          },
          {
            label: 'Return',
            data: [premiumInput.firstYearBonus, ...tableData.returnInDollar],
            backgroundColor: colors.Return,
            stack: 'Stack 0'
          }
        ]
      };

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Term Year'
              }
            },
            y: {
              stacked: true,
              title: {
                display: true,
                text: 'Amount (USD)',
              },
              ticks: {
                callback: (value) => `${Math.abs(value/1000).toFixed(0)}K`
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || '';
                  const value = context.raw >= 0 ? context.raw : -context.raw;
                  return `${label}: $${Math.round(value/1000)}K`;
                }
              }
            },
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 20,
                padding: 20
              }
            },
            datalabels: {
              display: true,
              color: function(context) {
                return context.datasetIndex === 2 ? 'black' : 'white';
              },
              anchor: 'center',
              align: 'center',
              clamp: true,
              formatter: (value, context) => {
                if (value === 0) return null;
                return context.dataset.label;
              },
              font: {
                weight: 'bold',
                size: 12
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [termsData, premiumInput, tableData, viewMode]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ textAlign: 'end' }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <Typography variant="body1" style={{ fontSize: '125%', fontWeight: 500 }}>
                      Ver. 1
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton size="small" style={{ padding: 4 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" justifyContent="flex-end">
                  <IconButton color="primary" aria-label="More Info">
                    <Info />
                  </IconButton>
                  <Select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    input={<InputBase style={{ fontSize: 12 }} />}  // Corrected line
                    IconComponent={ExpandMore}
                    >
                    <MenuItem value="Return Detail">Return Detail</MenuItem>
                    <MenuItem value="Principal vs Net Return">Principal vs Net Return</MenuItem>
                    <MenuItem value="Net Cash">Net Cash</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="body1">
              Return Detail
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ position: 'relative', height: '400px' }}>
            <canvas ref={chartRef} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReturnChart;