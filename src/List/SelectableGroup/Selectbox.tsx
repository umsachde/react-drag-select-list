import React, {CSSProperties, Component } from 'react';

export type TSetSelectboxState = React.Dispatch<
  React.SetStateAction<TSelectboxState>
>;

export type TSelectboxProps = {
  fixedPosition: boolean;
  className: string;
  getSetState(setState: TSetSelectboxState): void;
};

export type TSelectboxState = {
  y: number;
  x: number;
  width: number;
  height: number;
};

class Selectbox extends Component<TSelectboxProps> {

  state:TSelectboxState  = {
    y: 0,
    x: 0,
    width: 0,
    height: 0,
  }

  constructor(props:TSelectboxProps) {
    super(props)
  }

  static defaultProps = {
    className: 'selectable-selectbox',
  }

  setSelectBoxState = (updateState: TSelectboxState) => {
    this.setState({...updateState})
  }

  componentWillMount() {
    this.props.getSetState(this.setState);
  }

  getBoxStyle = ():CSSProperties => {
    const { fixedPosition } = this.props;
    const {x, y, width, height} = this.state;
    return {
    left: x,
    top: y,
    width: width,
    height: height,
    zIndex: 9000,
    position: fixedPosition ? 'fixed' : 'absolute',
    cursor: 'default',
    willChange: 'transform',
    transform: 'translateZ(0)',
    }
  };

  render () {
    return <div className={this.props.className} style={this.getBoxStyle()} />;
  }
}

export default Selectbox;