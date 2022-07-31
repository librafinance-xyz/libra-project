import React from 'react';
import styled from 'styled-components';
type CardContentProps = {
  children: React.ReactNode; 
};
const CardContent = (props: CardContentProps) => <StyledCardContent>{props.children}</StyledCardContent>;

const StyledCardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[4]}px;
`;

export default CardContent;
