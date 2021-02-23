import { CSSProperties } from "react";

const BACKGROUND_ALPHA = 0.1;
const infoBlue = 'rgb(237, 241, 254)';
const darkBlue = 'rgb(0, 108, 187)';
const darkerBlue = 'rgb(0, 59, 102)';
const green = 'rgb(45, 180, 112)';
const orange = 'rgb(246, 141, 48)';
const darkOrange = 'rgb(243, 109, 0)';
const white = 'rgb(255, 255, 255)';
const black = 'rgb(23, 32, 38)';
const red = 'rgb(233, 20, 49)';
const lightRed = 'rgb(255, 233, 234)';
const lightGrey = 'rgb(219, 225, 229)';
const darkGrey = 'rgb(141,148,153)';

export const theme = {
    colors: {
        white,
        lightGrey,
        red,
        alphaColor:BACKGROUND_ALPHA,
        darkGrey
    }
}

export const getAlphaColor = (color: string, alpha: number) => {
    let variable = color.replace(/rgb/i, 'rgba');
    variable = variable.replace(/\)/i, `,${alpha})`);
    return variable;
};

export const ErrorContainerStyle = {
    display: 'flex',
    paddingTop: 3,
    alignItems: 'center'
}

export const ErrorTextStyle = {
    color: theme.colors.red,
    fontSize: 12,
    marginLeft: 7
}

export const ListLoadingOverlayStyle:CSSProperties = {  
    backgroundColor: getAlphaColor(theme.colors.white, 0.7),
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
}