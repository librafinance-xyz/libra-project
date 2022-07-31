import React from 'react';
import styled from 'styled-components';

import Card from '../Card';
import CardContent from '../CardContent';
import Container from '../Container';

export interface ModalProps {
  onDismiss?: () => void;
}

type ModalProp = {
  children: React.ReactNode; // 👈️ type children
};


const Modal = (props: ModalProp) => {
  return (
    <Container size="sm">
      <StyledModal>
        <Card>
          <CardContent>{props.children}</CardContent>
        </Card>
      </StyledModal>
    </Container>
  );
};

const StyledModal = styled.div`
  border-radius: 12px;
  position: relative;
`;

export default Modal;
