import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Typography,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const TermsTable = ({ termsAndCashValue, premiumInput, bankInterest, tableData, setInputs, currencySwitch }) => {
  const { t, i18n } = useTranslation(); // Include i18n to access current language
  const currentLanguage = i18n.language; // Correctly retrieve the current language
  const [expandedRow, setExpandedRow] = useState(null);
//   console.log('Current language:', currentLanguage); // Log the detected language

  useEffect(() => {
    const calculateTableData = () => {
      const newTotalExpense = termsAndCashValue.term.map(term =>
        premiumInput.loanAmount * (bankInterest.loanInterest / 100) * term
      );

      const newNetCash = termsAndCashValue.cashValue.map(cashValue =>
        cashValue - premiumInput.loanAmount
      );

      const newReturnInDollar = termsAndCashValue.cashValue.map((cashValue, index) => {
        const totalExpense = newTotalExpense[index];
        return cashValue - premiumInput.principal - premiumInput.loanAmount - totalExpense;
      });

      const newReturnRate = newReturnInDollar.map(rd =>
        (rd / premiumInput.principal) * 100
      );

      setInputs(prev => ({
        ...prev,
        totalExpense: newTotalExpense,
        netCash: newNetCash,
        returnInDollar: newReturnInDollar,
        returnRate: newReturnRate,
      }));
    };

    calculateTableData();
  }, [termsAndCashValue, premiumInput, bankInterest, setInputs]);

  const headerColors = [
    'grey',
    'rgb(57, 102, 248)',
    'rgb(255, 192, 0)',
    'rgb(102, 94, 255)',
    'rgb(62, 199, 248)',
    'rgb(15, 175, 63)'
  ];

  const termsData = termsAndCashValue.term.map((term, index) => ({
    term,
    cashValue: termsAndCashValue.cashValue[index],
    totalExpense: tableData.totalExpense[index],
    netCash: tableData.netCash[index],
    returnInDollar: tableData.returnInDollar[index],
    returnRate: tableData.returnRate[index]
  }));

  const toggleRow = (index, event) => {
    setExpandedRow(expandedRow === index ? null : index);
    if (event) event.currentTarget.blur();
  };

  const formatNumber = (num) => {
    let value = currencySwitch ? num * 7.8 : num; // Adjust for HKD if currencySwitch is true
    const locale = i18n.language || 'en'; // Fallback to 'en' if undefined
    let formatted;
  
    try {
      if (locale.startsWith('zh')) { // Check for Chinese locales
        if (value >= 10000) {
          const wanValue = value / 10000;
          const unit = locale === 'zh-HK' ? '萬' : '万'; // '萬' for zh-HK, '万' for zh-CN
          formatted = wanValue.toFixed(1) + unit;
        } else {
          formatted = value.toLocaleString(locale); // Use locale-specific formatting
        }
      } else { // Default to English formatting
        if (value >= 1000) {
          const kValue = Math.round(value / 1000);
          formatted = kValue.toLocaleString('en') + 'K';
        } else {
          formatted = Math.round(value).toLocaleString('en');
        }
      }
    } catch (error) {
      console.error('Error formatting number with locale:', locale, error);
      formatted = value.toString(); // Fallback to plain string if all else fails
    }
  
    return currencySwitch ? `HK${formatted}` : formatted; // Add HK prefix if currencySwitch is true
  };

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Year', 'Principal', 'Total_Expense', 'Cash_Value', 'Net_Cash', 'Return'].map(
                  (header, index) => (
                    <TableCell
                    sx={{ fontSize: '18px', fontWeight: 'bold'  }}
                      key={header}
                      align="center"
                      style={{ borderBottom: `6px solid ${headerColors[index]}` }}
                    >
                      {t(header)}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {termsData.map((data, index) => {
                const isExpanded = expandedRow === index;
                const annualizedReturn = Math.pow(1 + (data.returnRate / 100), 1 / data.term) - 1;

                return (
                  <React.Fragment key={data.term}>
                    <TableRow>
                      <TableCell align="center" sx={{ fontSize: '18px',  }}>{data.term}</TableCell>
                      <TableCell align="center" sx={{ fontSize: '18px',  }}>{formatNumber(premiumInput.principal)}</TableCell>
                      <TableCell align="center"sx={{ fontSize: '18px',  }}>{formatNumber(data.totalExpense)}</TableCell>
                      <TableCell align="center"sx={{ fontSize: '18px',  }}>{formatNumber(data.cashValue)}</TableCell>
                      <TableCell align="center"sx={{ fontSize: '18px',  }}>{formatNumber(data.netCash)}</TableCell>
                      <TableCell align="center">
                        <Grid container alignItems="center" justifyContent="center">
                          <Grid item xs={10}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                              <Grid item>
                                <Typography variant="body2" sx={{ fontSize: '18px',  }}>
                                  {formatNumber(data.returnInDollar)}
                                </Typography>
                              </Grid>
                              <Grid item>
                                   <Typography
                              sx={{
                                fontSize: '20px',
                                backgroundColor: 'green', // 藍色背景
                                color: 'white', // 白色文字
                                borderRadius: '8px', // 圓角
                                padding: '4px 8px', // 內距
                                display: 'inline-block', // 讓它不佔滿整行
                              }}
                            >
                              {data.returnRate.toFixed(2)}%
                            </Typography>

                              </Grid>
                              {isExpanded && (
                                <Grid item>
                                  <Typography variant="caption">
                                    {t('Annualized')}: {(annualizedReturn * 100).toFixed(2)}%
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              size="small"
                              onClick={(e) => toggleRow(index, e)}
                              onMouseDown={(e) => e.preventDefault()}
                              aria-label="expand row"
                            >
                              {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>

                    {/* Collapsible Row */}
                    <TableRow className="collapse-rows">
                      {[0, 1, 2, 3, 4, 5].map((colIndex) => (
                        <TableCell
                          key={colIndex}
                          align="center"
                          colSpan={1}
                          style={{
                            padding: 0,
                            borderBottom: colIndex === 5 ? 'none' : undefined
                          }}
                        >
                          <Collapse
                            in={isExpanded}
                            style={{ minHeight: 0 }}
                          >
                            <div className="MuiCollapse-wrapperInner">
                              {colIndex === 2 && (
                                `${formatNumber(premiumInput.loanAmount)} x ${bankInterest.loanInterest.toFixed(1)}% x ${data.term}`
                              )}
                              {colIndex === 4 && (
                                `${formatNumber(data.cashValue)} - ${formatNumber(premiumInput.loanAmount)}`
                              )}
                              {colIndex === 5 && (
                                <>
                                  ({formatNumber(data.cashValue)} - {formatNumber(premiumInput.principal)} -{' '}
                                  {formatNumber(premiumInput.loanAmount)} - {formatNumber(data.totalExpense)}){' '}
                                  <span style={{ color: 'rgb(57, 102, 248)' }}>
                                    ( / {formatNumber(premiumInput.principal)} )
                                  </span>
                                </>
                              )}
                            </div>
                          </Collapse>
                        </TableCell>
                      ))}
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TermsTable;