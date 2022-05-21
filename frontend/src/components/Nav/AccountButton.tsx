import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { useWallet } from 'use-wallet';
import useModal from '../../hooks/useModal';
import WalletProviderModal from '../WalletProviderModal';
import AccountModal from './AccountModal';
import LightningImage from '../../assets/img/lightning.svg';
import Image from 'material-ui-image';

interface AccountButtonProps {
  text?: string;
  onOpen?: () => void;
}

const AccountButton: React.FC<AccountButtonProps> = ({ text, onOpen }) => {
  const { account } = useWallet();
  const [onPresentAccountModal] = useModal(<AccountModal />);

  const [isWalletProviderOpen, setWalletProviderOpen] = useState(false);

  const handleWalletProviderOpen = () => {
    setWalletProviderOpen(true);
    onOpen && onOpen();
  };

  const handleWalletProviderClose = () => {
    setWalletProviderOpen(false);
  };

  const handleAccountModalOpen = () => {
    onPresentAccountModal()
    onOpen && onOpen();
  }

  const buttonText = text ? text : 'Unlock';

  return (
    <div>
      {!account ? (
        <Button onClick={handleWalletProviderOpen} variant="contained"  style={{ backgroundColor: 'rgba(255,255,255,0)'}} >
          <Image className="ombImg-home" color="none" style={{ height: '16px', width: '16px', marginRight: '4px'}} src={LightningImage} />
          {buttonText}
        </Button>
      ) : (
        <Button variant="contained" onClick={handleAccountModalOpen}style={{ backgroundColor: 'rgba(255,255,255,0)'}} >
          My Wallet
        </Button>
      )}

      <WalletProviderModal open={isWalletProviderOpen} handleClose={handleWalletProviderClose} />
      {/* <AccountModal open={isAccountModalOpen} handleClose={handleAccountModalClose}/> */}
    </div>
  );
};

export default AccountButton;
