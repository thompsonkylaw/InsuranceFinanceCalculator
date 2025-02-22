import React, { useState } from 'react';
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

const TermsTable = ({ termsAndCashValue, premiumInput, BankInterest }) => {
  const [expandedRow, setExpandedRow] = useState(null);

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
    cashValue: termsAndCashValue.cashValue[index]
  }));

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const formatNumber = (num) => {
    return num>999 ? Math.round(num/1000).toLocaleString() + 'K' : Math.round(num).toLocaleString();
  };

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Year', 'Principal', 'Total Expense', 'Cash Value', 'Net Cash', 'Return'].map(
                  (header, index) => (
                    <TableCell
                      key={header}
                      align="center"
                      style={{ borderBottom: `6px solid ${headerColors[index]}` }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {termsData.map((termObj, index) => {
                const term = termObj.term;
                const principal = premiumInput.principal;
                const loanAmount = premiumInput.loadAmount;
                const totalExpense = loanAmount * BankInterest.loanInterest /100 * term;
                const cashValue = termObj.cashValue;
                const netCash = cashValue - loanAmount;
                const returnValue = (cashValue - principal - loanAmount - totalExpense) / principal;
                const annualizedReturn = Math.pow(1 + returnValue, 1 / term) - 1;

                const isExpanded = expandedRow === index;

                return (
                  <React.Fragment key={term}>
                    <TableRow>
                      <TableCell align="center">{term}</TableCell>
                      <TableCell align="center">{formatNumber(principal)}</TableCell>
                      <TableCell align="center">{formatNumber(totalExpense)}</TableCell>
                      <TableCell align="center">{formatNumber(cashValue)}</TableCell>
                      <TableCell align="center">{formatNumber(netCash)}</TableCell>
                      <TableCell align="center">
                        <Grid container alignItems="center" justifyContent="center">
                          <Grid item xs={10}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                              <Grid item>
                                <Typography variant="body2">
                                  {formatNumber(returnValue * principal)}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography color="primary">
                                  {(returnValue * 100).toFixed(2)}%
                                </Typography>
                              </Grid>
                              {isExpanded && (
                                <Grid item>
                                  <Typography variant="caption">
                                    Annualized: {(annualizedReturn * 100).toFixed(2)}%
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              size="small"
                              onClick={() => toggleRow(index)}
                              aria-label="expand row"
                            >
                              {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>

                    {/* Collapsible Row */}
                    <TableRow>
                      <TableCell style={{ padding: 0 }} colSpan={6}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Table size="small">
                            <TableBody>
                              <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell>
                                  {loanAmount}K × {(BankInterest.loanInterest * 100).toFixed(1)}% × {term}
                                </TableCell>
                                <TableCell />
                                <TableCell>
                                  {cashValue}K − {loanAmount}K
                                </TableCell>
                                <TableCell>
                                  ({cashValue}K − {principal}K − {loanAmount}K − {formatNumber(totalExpense)}) / {principal}K
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
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