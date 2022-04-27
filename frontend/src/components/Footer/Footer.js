import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Typography, Link } from '@material-ui/core';
import TwitterImage from '../../assets/img/twitter.svg';
import GithubImage from '../../assets/img/github.svg';
import TelegramImage from '../../assets/img/telegram.svg';
import DiscordImage from '../../assets/img/discord.svg';
import YoutubeImage from '../../assets/img/youtube.svg';
import AuditImage from '../../assets/img/AuditByAstar.svg';
import AstarImage from '../../assets/img/PoweredByAstar.svg';

const useStyles = makeStyles((theme) => ({
  footer: {
    position: 'absolute',
    bottom: '0',
    paddingTop: '16px',
    paddingBottom: '48px',
    width: '100%',
    color: 'var(--white)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    height: '1.3rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    width: '24px',
    height: '24px',
    display: 'inline',
    marginLeft: '20px',
    color: 'var(--white)',
    textDecoration: 'none',
  },

  margin: {
    marginRight: '24px',
    height: '40px',
  },

  img: {
    height: '40px',
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={6} style={{ margin: 'auto' }}>
            <Typography align="left">
            <a href="https://docs.librafinance.xyz" rel="noopener noreferrer" target="_blank" className={classes.link}>
              Docs
            </a>
            <a href="https://twitter.com/LibraAstar" rel="noopener noreferrer" target="_blank" className={classes.link}>
              Twitter
            </a>
            <a href="https://discord.librafinance.xyz" rel="noopener noreferrer" target="_blank" className={classes.link}>
              Discord
            </a>
            <a href="https://github.com/librafinance-xyz" rel="noopener noreferrer" target="_blank" className={classes.link}>
              Github
            </a>
            <a href="https://github.com/librafinance-xyz/libra-project/blob/main/audit/Libra_Finance_xyz_Protocol_Smart_Contracts_Security_Audit_Report.pdf" rel="noopener noreferrer" target="_blank" className={classes.link}>
              Audit
            </a>
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            {/* <a href="https://twitter.com/LibraAstar" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="twitter" src={TwitterImage} className={classes.img} />
            </a>
            <a
              href="https://github.com/librafinance-xyz"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="github" src={GithubImage} className={classes.img} />
            </a> */}
            {/* <a href="https://bit.ly/3AUcaBI" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="telegram" src={TelegramImage} className={classes.img} />
            </a> */}
            {/* <a
              href="https://www.youtube.com/results?search_query=2omb+finance"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}
            >
              <img alt="youtube" src={YoutubeImage} className={classes.img} />
            </a> */}
            {/* <a href="https://discord.gg/EKF4sWchu7" rel="noopener noreferrer" target="_blank" className={classes.link}>
              <img alt="discord" src={DiscordImage} className={classes.img} />
            </a> */}
            <img alt="AuditImage" src={AuditImage} className={classes.margin} />
            <img alt="AstarImage" src={AstarImage} className={classes.img}/>
          </Grid>
          
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
