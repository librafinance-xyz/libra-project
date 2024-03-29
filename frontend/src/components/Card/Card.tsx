import React from 'react';
import styled from 'styled-components';
type CardProps = {
  children: React.ReactNode; 
};
const Card = (props: CardProps) => <StyledCard>{props.children}</StyledCard>;

const StyledCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9); //${(props) => props.theme.color.grey[800]};
  color: #2c2560 !important;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export default Card;
