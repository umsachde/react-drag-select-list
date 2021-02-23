import React, { Component, CSSProperties, FC } from "react";
import { theme } from "../utils/constants";

interface IListContainerProps {
  error: boolean;
  isLoading: boolean;
  customClassName?: string;
}

const getContainerStyle = (error: boolean, isLoading: boolean):CSSProperties => ({
    position: 'relative',
    border: `1px solid ${(error ? theme.colors.red : theme.colors.lightGrey)}`,
    backgroundColor: theme.colors.white,
    maxHeight: 474,
    width: '100%',
    borderRadius: 5,
    overflowY: isLoading ? 'hidden' : 'scroll'
});

class ListContainer extends Component<IListContainerProps> {

  render() {
  const { isLoading, error, children, customClassName } = this.props;
  const listContainerStyle = getContainerStyle(error, isLoading);
  return <div className={customClassName} style={listContainerStyle}>
      {children}
  </div>;
  }
}

export default ListContainer;
