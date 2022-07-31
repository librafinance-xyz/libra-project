import React from 'react';
import styled from 'styled-components';

export interface IconProps {
  color?: string;
  children?: React.ReactNode;
}

const Icon = (props: IconProps)  => <StyledIcon>{props.children}</StyledIcon>;

const StyledIcon = styled.div``;

export default Icon;
