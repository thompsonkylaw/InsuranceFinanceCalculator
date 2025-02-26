import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputBase
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js plugins
Chart.register(ChartDataLabels, annotationPlugin);

const ReturnChart = ({ termsData, premiumInput, tableData, currencySwitch }) => {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = React.useState('Return Detail');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Define colors for each dataset
  const colors = {
    Principal: 'rgb(57, 102, 248)',
    LoanAmount: 'rgb(255, 165, 0)',
    TotalExpense: 'rgb(255, 192, 0)',
    Return: 'rgb(15, 175, 63)',
    NetCash: 'rgb(62, 199, 248)'
  };

  // Convert currency based on currencySwitch (USD to HKD if true)
  const convertCurrency = (value) => {
    return currencySwitch ? value * 7.8 : value;
  };

  // Enhanced formatNumber function with language detection
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    const absNum = Math.abs(num);
    const roundedNum = Math.round(absNum);

    // Detect current language from i18n
    const lang = i18n.language;
   
    if (lang.startsWith('zh')) {
      // Chinese formatting: use "萬" (Traditional) or "万" (Simplified) for ≥ 10,000
      const isTraditional = lang === 'zh-HK';
      
      if (absNum >= 10000) {
        const wanValue = (absNum / 10000).toFixed(1).replace(/\.0$/, '');
        return `${num < 0 ? '-' : ''}${wanValue}${isTraditional ? '萬' : '万'}`;
      }
      return num.toString(); // No suffix for < 10,000
    } else {
      // English (and default) formatting: use commas and "K" for thousands
      if (absNum >= 1000) {
        const kValue = Math.round(absNum / 1000);
        return `${num < 0 ? '-' : ''}${kValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}K`;
      }
      return num.toString();
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Generate labels for x-axis with translation
      const labels = [t('Year 0'), ...termsData.term.map(term => `${t('Yearth', { year: term })} `)];
      let datasets = [];

      // Configure datasets based on viewMode
      if (viewMode === 'Net Cash') {
        datasets = [
          {
            label: t('Principal'),
            data: [premiumInput.principal, ...termsData.term.map(() => 0)],
            backgroundColor: colors.Principal,
            stack: 'Stack 0'
          },
          {
            label: t('Net Cash'),
            data: [0, ...tableData.netCash],
            backgroundColor: colors.NetCash,
            stack: 'Stack 0'
          }
        ];
      } else {
        const isPrincipalView = viewMode === 'Principal vs Net Return';
        datasets = [
          {
            label: t('Principal'),
            data: [premiumInput.principal, ...termsData.term.map(() => premiumInput.principal)],
            backgroundColor: colors.Principal,
            stack: 'Stack 0'
          },
          {
            label: t('Loan Amount'),
            data: [premiumInput.loanAmount, ...termsData.term.map(() => premiumInput.loanAmount)],
            backgroundColor: colors.LoanAmount,
            stack: 'Stack 0',
            hidden: isPrincipalView
          },
          {
            label: t('Total Expense'),
            data: [0, ...tableData.totalExpense],
            backgroundColor: colors.TotalExpense,
            stack: 'Stack 0',
            hidden: isPrincipalView
          },
          {
            label: t('Return'),
            data: [
              isPrincipalView ? 0 : premiumInput.firstYearBonus,
              ...tableData.returnInDollar
            ],
            backgroundColor: colors.Return,
            stack: 'Stack 0'
          }
        ];
        if (isPrincipalView) {
          datasets = datasets.filter(d => [t('Principal'), t('Return')].includes(d.label));
        }
      }

      // Apply currency conversion to all dataset values
      datasets = datasets.map(ds => ({
        ...ds,
        data: ds.data.map(value => convertCurrency(value))
      }));

      // Calculate the maximum total value across all labels
      const maxTotal = Math.max(...labels.map((_, index) =>
        datasets.reduce((sum, ds) => sum + (ds.data[index] || 0), 0)
      ));

      // Add datalabels configuration for inside bar labels
      const updatedDatasets = datasets.map(ds => ({
        ...ds,
        datalabels: {
          anchor: 'center',
          align: 'center',
          color: 'white',
          font: { weight: 'bold', size: 12 },
          formatter: (value) => value ? formatNumber(value) : null
        }
      }));

      // Create annotations for top labels based on viewMode
      const annotations = labels.map((label, index) => {
        if (viewMode === 'Return Detail') {
          const total = datasets.reduce((sum, ds) => sum + (ds.data[index] || 0), 0);
          if (index === 0) {
            const premiumValue = convertCurrency(premiumInput.premium || 0);
            return {
              type: 'label',
              xValue: index,
              yValue: total,
              content: formatNumber(premiumValue),
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              font: { size: 12, weight: 'bold' },
              position: 'center',
              yAdjust: -20
            };
          } else {
            const returnRate = parseFloat(tableData.returnRate[index - 1]) || 0;
            return {
              type: 'label',
              xValue: index,
              yValue: total,
              content: [
                `${t('Return')}: ${returnRate.toFixed(2)}%`,
                `${t('Cash Value')}: ${formatNumber(total)}`
              ],
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              font: { size: 12, weight: 'bold' },
              position: 'center',
              yAdjust: -30
            };
          }
        } else if (viewMode === 'Principal vs Net Return') {
          const principal = datasets[0].data[index];
          const returnValue = datasets[1].data[index];
          const total = principal + returnValue;
          if (index === 0) {
            return {
              type: 'label',
              xValue: index,
              yValue: total,
              content: `${t('Principal')}: ${formatNumber(principal)}`,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              font: { size: 12, weight: 'bold' },
              position: 'center',
              yAdjust: -20
            };
          } else {
            const returnRate = parseFloat(tableData.returnRate[index - 1]) || 0;
            return {
              type: 'label',
              xValue: index,
              yValue: total,
              content: [
                `${t('Total')}: ${formatNumber(total)}`,
                `${t('Return_Rate')}: ${returnRate.toFixed(2)}%`
              ],
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              font: { size: 12, weight: 'bold' },
              position: 'center',
              yAdjust: -30
            };
          }
        } else if (viewMode === 'Net Cash') {
          const principal = datasets[0].data[0];
          const netCash = datasets[1].data[index];
          if (index === 0) {
            return {
              type: 'label',
              xValue: index,
              yValue: principal,
              content: `${t('Principal')}: ${formatNumber(principal)}`,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              font: { size: 12, weight: 'bold' },
              position: 'center',
              yAdjust: -20
            };
          } else {
            const gain = principal !== 0 ? netCash / principal : 0;
            return {
              type: 'label',
              xValue: index,
              yValue: netCash,
              content: [
                `${t('Net Cash')}: ${formatNumber(netCash)}`,
                `${t('Gain')}: ${gain.toFixed(2)}x`
              ],
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              font: { size: 12, weight: 'bold' },
              position: 'center',
              yAdjust: -30
            };
          }
        }
        return null;
      }).filter(a => a !== null);

      // Chart data and options
      const chartData = { labels, datasets: updatedDatasets };
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 40
          }
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: t('Term Year') }
          },
          y: {
            stacked: true,
            title: { display: true, text: currencySwitch ? `${t('Amount')} (HKD)` : `${t('Amount')} (USD)` },
            ticks: {
              callback: (value) => formatNumber(value)
            },
            max: maxTotal * 1.2
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.raw >= 0 ? context.raw : -context.raw;
                const symbol = currencySwitch ? 'HK$' : '$';
                return `${label}: ${symbol}${formatNumber(value)}`;
              }
            }
          },
          legend: { position: 'bottom', labels: { boxWidth: 20, padding: 20 } },
          annotation: { annotations }
        }
      };

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [termsData, premiumInput, tableData, viewMode, currencySwitch, i18n.language]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ textAlign: 'end' }}>
            <Select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              input={<InputBase style={{ fontSize: 12 }} />}
              IconComponent={ExpandMore}
            >
              <MenuItem value="Return Detail">{t('Return Detail')}</MenuItem>
              <MenuItem value="Principal vs Net Return">{t('Principal vs Net Return')}</MenuItem>
              <MenuItem value="Net Cash">{t('Net Cash')}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="body1">
              {viewMode === 'Net Cash' ? t('Value after Repayment') : t(viewMode)}
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