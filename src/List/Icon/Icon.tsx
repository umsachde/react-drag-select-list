import React, { FC } from 'react';

export enum IconTestIds {
  CaretUp = 'caret-up-icon',
  CaretDown = 'caret-down-icon',
  Car = 'car-icon',
  Bike = 'bike-icon',
  LocationMap = 'location-map',
}

export enum IconType {
  AlertTriangle,
  Loading,
}

export enum IconSize {
  s12 = 12,
  s13 = 13,
  s20 = 20,
  s22 = 22,
  s24 = 24,
  s27 = 27,
  s53 = 53,
  s64 = 64,
}

export enum IconColor {
  Blue = '#006cbb',
  Orange = '#f68d30',
  DarkOrange = '#f36d00',
  Red = '#E91431',
  LightGrey = '#E7E8E9',
  Grey = '#B9BCBD',
  DarkGrey = '#8e959a',
  Green = '#2db470',
  Black = '#172026',
  InfoBlue = '#125fca',
}

interface IIcon {
  type: IconType;
  height: IconSize;
  width: IconSize;
  color: IconColor;
  secondaryColor?: IconColor;
}

const getSVG = (
  iconType: IconType,
  height: number,
  width: number,
  color: string,
  secondaryColor?: string,
) => {
  const svgWidth = `${width}px`;
  const svgHeight = `${height}px`;

  switch (iconType) {
    case IconType.Loading: {
      return (
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>icons/loading</title>
          <desc>Created with Sketch.</desc>
          <g
            id="icons/loading"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <path
              d={`M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,
              21 3,16.9705627 3,12 C3.00557987,7.03175034 7.03175034,3.00557987 12,3 Z M12,
              6 C8.6877869,6.00360742 6.00360742,8.6877869 6,12 C6,15.3137085 8.6862915,18 12,
              18 C15.3137085,18 18,15.3137085 18,12 C18,8.6862915 15.3137085,6 12,6 Z`}
              id="Circle"
              fill={secondaryColor}
            />
            <path
              d={`M5.2024372,17.8987814 C3.83046557,16.3191262 3,14.2565459 3,12 C3.00216535,10.0719953 3.60980985,
              8.2858627 4.64302371,6.82151186 L7.37161286,8.18580643 C6.51604369,9.22251645 6.00157795,10.5511758 6,
              12 C6,13.7866197 6.78088802,15.3908532 8.01997569,16.4900122 L5.2024372,17.8987814 Z`}
              id="Combined-Shape"
              fill={color}
            />
          </g>
        </svg>
      );
    }

    case IconType.AlertTriangle: 
    default: {
      return (
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox="0 0 20 18"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>icons/alert/warning</title>
          <desc>Created with Sketch.</desc>
          <g
            id="Icons"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Skip-Custom-Icons"
              transform="translate(-502.000000, -188.000000)"
            >
              <g
                id="icons/alert/triangle"
                transform="translate(500.000000, 185.000000)"
              >
                <g id="alert-triangle">
                  <polygon id="Colour" points="0 24 24 24 24 0 0 0" />
                  <path
                    d={`M21.7748958,18.2782292 C22.4157986,19.3891319 21.6113194,20.7777778 20.33125,
                    20.7777778 L3.66854167,20.7777778 C2.38600694,20.7777778 1.58524306,19.3869792 2.22489583,
                    18.2782292 L10.5563542,3.8328125 C11.1975694,2.72138889 12.8035764,
                    2.72340278 13.4436458,3.8328125 L21.7748958,18.2782292 Z M12,15.2916667 C11.1178819,
                    15.2916667 10.4027778,16.0067708 10.4027778,
                    16.8888889 C10.4027778,17.7710069 11.1178819,18.4861111 12,
                    18.4861111 C12.8821181,18.4861111 13.5972222,
                    17.7710069 13.5972222,16.8888889 C13.5972222,16.0067708 12.8821181,15.2916667 12,
                    15.2916667 Z M10.4835764,9.55048611 L10.7411458,14.2727083 C10.7531944,
                    14.4936806 10.9359028,14.6666667 11.1571875,14.6666667 L12.8428125,14.6666667 C13.0640972,
                    14.6666667 13.2468056,14.4936806 13.2588542,14.2727083 L13.5164236,9.55048611 C13.5294444,
                    9.31180556 13.3394097,9.11111111 13.1003819,9.11111111 L10.8995833,9.11111111 C10.6605556,
                    9.11111111 10.4705556,9.31180556 10.4835764,9.55048611 L10.4835764,9.55048611 Z`}
                    id="Colour"
                    fill={color}
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
      );
    }

  }
};

const Icon: FC<IIcon> = ({ type, width, height, color, secondaryColor }) => {
  return getSVG(type, width, height, color, secondaryColor);
};

export default Icon;
