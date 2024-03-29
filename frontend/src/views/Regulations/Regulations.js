import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import Page from '../../components/Page';
import RegulationsImage from '../../assets/img/regulations_bg.png';
import { createGlobalStyle } from 'styled-components';
import useLibraFinance from '../../hooks/useLibraFinance';

import HomeImage from '../../assets/img/home.png'; //  Subject to change

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
* {
    border-radius: 0 !important;
}
`;

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#2c2560',
    fontWeight: 'bolder',
  },
  body: {
    fontSize: 14,
    color: '#2c2560',
  },
}))(TableCell);
const useStyles = makeStyles((theme) => ({
  gridItem: {
    height: '100%',
    [theme.breakpoints.up('md')]: {
      height: '90px',
    },
  },
}));

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgb(0,0,0)',
    },
  },
}))(TableRow);

const Regulations = () => {
  const classes = useStyles();
  const libraFinance = useLibraFinance();
  const [rows, setRows] = useState(null);
  function createData(epoch, dao, dev, insurance, boardroom, bondsBought, bondsRedeemed) {
    var sum = ((Number(dao)? Number(dao) : 0) + (Number(dev)? Number(dev) : 0) + (Number(insurance)? Number(insurance) : 0) + Number(boardroom)).toFixed(2);
    return { epoch, dao, dev, insurance, boardroom, sum, bondsBought, bondsRedeemed };
  }
  useEffect(() => {
    if (libraFinance) {
      const thisData = libraFinance.listenForRegulationsEvents();
      thisData.then((elements) => {
        setRows(
          elements
            .reverse()
            .map((element) =>
              createData(
                element.epoch,
                element.daoFund,
                element.devFund,
                element.insuranceFund,
                element.boardroomFund,
                element.bondsBought,
                element.bondsRedeemed,
              ),
            ),
        );
      });
    }
  }, [libraFinance]);

  return (
    <Page>
      <BackgroundImage />
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Regulations
      </Typography>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Epoch</StyledTableCell>
              <StyledTableCell align="center">Boardroom</StyledTableCell>
              <StyledTableCell align="center">DAO</StyledTableCell>
              <StyledTableCell align="center">DEV</StyledTableCell>
              <StyledTableCell align="center">Insurance</StyledTableCell>
              <StyledTableCell align="center">Total</StyledTableCell>
              <StyledTableCell align="center">Bonds Bought</StyledTableCell>
              <StyledTableCell align="center">Bonds Redeemed</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => (
              <StyledTableRow
                style={index % 2 ? { background: 'rgba(255,255,255,0.9)' } : { background: 'rgba(255,255,255,0.8)' }}
                key={row.epoch}
              >
                <StyledTableCell style={{ color: '#2c2560' }} align="center" component="th" scope="row">
                  {row.epoch}
                </StyledTableCell>
                <StyledTableCell align="center">{row.boardroom}</StyledTableCell>
                <StyledTableCell align="center">{row.dao}</StyledTableCell>
                <StyledTableCell align="center">{row.dev}</StyledTableCell>
                <StyledTableCell align="center">{row.insurance}</StyledTableCell>
                <StyledTableCell align="center">{row.sum}</StyledTableCell>
                <StyledTableCell align="center">{row.bondsBought}</StyledTableCell>
                <StyledTableCell align="center">{row.bondsRedeemed}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  );
};

export default Regulations;
