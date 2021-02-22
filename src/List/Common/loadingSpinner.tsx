import styled, { keyframes } from 'styled-components';
import React from 'react';
import Icon, { IconColor, IconSize, IconType } from './Icon';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingOverlayContainer = styled.div<{
  absolutePositioning: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: ${props => (props.absolutePositioning ? 'absolute' : 'relative')};
  top: 70px;
  bottom: 0;
  left: 0;
  right: 0;
  animation: ${rotate} 1.25s linear infinite;
`;

export const renderLoadingSpinner = (absolutePositioning?: boolean) => (
  <LoadingOverlayContainer absolutePositioning={absolutePositioning || true}>
    <Icon
      type={IconType.Loading}
      width={IconSize.s64}
      height={IconSize.s64}
      color={IconColor.Grey}
      secondaryColor={IconColor.LightGrey}
    />
  </LoadingOverlayContainer>
);
