import React from 'react';
import styled from 'styled-components';

type ModalActionsProp = {
  children: React.ReactNode; // 👈️ type children
};

const ModalActions = (props: ModalActionsProp) => {
  const l = React.Children.toArray(props.children).length;
  return (
    <StyledModalActions>
      {React.Children.map(props.children, (child, i) => (
        <>
          <StyledModalAction>{child}</StyledModalAction>
          {i < l - 1 && <StyledSpacer />}
        </>
      ))}
    </StyledModalActions>
  );
};

const StyledModalActions = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.color.grey[100]}00;
  display: flex;
  height: 96px;
  margin: ${(props) => props.theme.spacing[4]}px ${(props) => -props.theme.spacing[4]}px
    ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
`;

const StyledModalAction = styled.div`
  flex: 1;
`;

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[4]}px;
`;

export default ModalActions;
