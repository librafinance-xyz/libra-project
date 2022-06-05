import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import styled from 'styled-components';

import ListItemLink from '../ListItemLink';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountButton from './AccountButton';
import LibnraFinanceLogo from '../../assets/libra/librafinance.svg';

const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  appBar: {
    color: 'var(--white)',
    'max-width': '85%',
    margin: '16px auto 2rem',
    'background-color': 'rgba(255,255,255,0.1)',
    // 'backdrop-filter': 'blur(2px)',
    // borderBottom: `1px solid ${theme.palette.divider}`,
    // padding: '0 10px',
    'border': '2px solid rgba(255, 255, 255, 0.2)',
    'border-radius': '8px!important',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
    backgroundColor: 'var(--backcolor)',
  },
  drawerPaper: {
    width: 240,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    fontFamily: 'Avenir',
    fontSize: '0px',
    flexGrow: 1,
  },
  link: {
    textTransform: 'uppercase',
    color: 'var(--textWhite)',
    fontSize: '14px',
    margin: theme.spacing(1, 2),
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  brandLink: {
    textDecoration: 'none',
    color: 'var(--white)',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Nav = () => {
  const matches = useMediaQuery('(min-width:900px)');
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Toolbar style={{ height: '72px'}}>
        {matches ? (
          <>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              {/* <a className={ classes.brandLink } href="/">2omb Finance</a> */}
              <Link to="/" color="inherit" className={classes.brandLink}>
               
                <img src={LibnraFinanceLogo} />
              </Link>
            </Typography>
            <Box mr={5}>
              <Link color="color" to="/" className={classes.link}>
                Home
              </Link>
              <Link color="textPrimary" to="/farms" className={classes.link}>
                Farms
              </Link>
              <Link color="textPrimary" to="/boardroom" className={classes.link}>
                Boardroom
              </Link>
              <Link color="textPrimary" to="/bonds" className={classes.link}>
                LBonds
              </Link>
              
              <a href="https://www.librax.finance" target="_blank" className={classes.link}>
                Swap
              </a>
              {/* <Link color="textPrimary" to="/rebates" className={classes.link}>
                3DAO
              </Link>  */}
              {/* <Link color="textPrimary" to="/treasury" className={classes.link}>
                Treasury
              </Link>  */}
              {/* <Link color="textPrimary" to="/sbs" className={classes.link}>
                SBS
              </Link> */}
              <Link color="textPrimary" to="/regulations" className={classes.link}>
                Regulations
              </Link>
              {/* <a href="https://alnair.finance" target="_blank" className={classes.link}>
                Vaults
              </a> */}
              {/* <a href="https://snapshot.org/#/librafinance.eth" target="_blank" className={classes.link}>
                Governance
              </a> */}
             
            </Box>
            <AccountButton text="Connect"/>
          </>
        ) : (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap  style={{ display: 'flex'}}>
              <img src={LibnraFinanceLogo} />
            </Typography>

            <Drawer
              className={classes.drawer}
              // onEscapeKeyDown={handleDrawerClose} // [ISSUE] Libra Finance
              // onBackdropClick={handleDrawerClose}  //[ISSUE] Libra Finance
              variant="temporary"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div>
                <IconButton 
                  color="inherit"
                  onClick={handleDrawerClose}
                  
                >
                  {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                <ListItemLink primary="Home" to="/" />
                <ListItemLink primary="Farms" to="/farms" />
                <ListItemLink primary="Room" to="/boardroom" />
                <ListItemLink primary="LBonds" to="/bonds" />
                <ListItem button component="a" href="https://www.librax.finance">
                  <ListItemText>Swap</ListItemText>
                </ListItem> 
                {/* <ListItemLink primary="3DAO" to="/rebates" /> */}
                {/* <ListItemLink primary="Treasury" to="/treasury" /> */}
                <ListItemLink primary="Boardroom" to="/boardroom" />
                {/* <ListItemLink primary="Pit" to="/pit" />
                <ListItemLink primary="SBS" to="/sbs" />
                <ListItemLink primary="Liquidity" to="/liquidity" /> */}
                <ListItemLink primary="Regulations" to="/regulations" /> 
                {/* <ListItem button component="a" href="https://beluga.fi">
                  <ListItemText>Vaults</ListItemText>
                </ListItem> */}
                {/* <ListItem button component="a" href="https://snapshot.org/#/forgiving.forg.eth">
                  <ListItemText>Governance</ListItemText>
                </ListItem> */}
                {/* <ListItem button component="a" href="https://docs.librafinance.xyz/">
                  <ListItemText>Docs</ListItemText>
                </ListItem> */}
                <ListItem style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountButton text="Connect" onOpen={handleDrawerClose} />
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
