import React, { CSSProperties } from 'react';
import Icon, { IconColor, IconSize, IconType } from '../Icon/Icon';


const keyFrames = `@-webkit-keyframes spinner {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}`;

const getLoadingSpinerStyle = (absolutePositioning?: boolean):CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: absolutePositioning === false ? 'relative' : 'absolute',
    top: 70,
    bottom: 0,
    left: 0,
    right: 0,
    animationName: '$spinner',
    animationDuration: '1.25s',
    animationTimingFunction: 'linear',
    animationIterationCount:'infinite',
})

export const renderLoadingSpinner = (absolutePositioning?: boolean) => {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(keyFrames, styleSheet.cssRules.length);
  const spinnerStyle = getLoadingSpinerStyle(absolutePositioning);
  return(
  <div style={spinnerStyle}>
    <Icon
      type={IconType.Loading}
      width={IconSize.s64}
      height={IconSize.s64}
      color={IconColor.Grey}
      secondaryColor={IconColor.LightGrey}
    />
  </div>
  )
};
