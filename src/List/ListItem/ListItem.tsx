import React from 'react';
import styled from 'styled-components';
import { createSelectable } from '../SelectableGroup';
import { IndexedListOption } from '../List';
import { TSelectableItemProps } from '../SelectableGroup/Selectable.types';

export interface ListItemProps {
  item: IndexedListOption;
  selected: boolean;
  rangeSelect: (item: IndexedListOption) => (event: React.MouseEvent) => void;
}

const StyledListItem = styled.div<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.lightGrey : theme.colors.white};
  color: ${props => props.theme.colors.darkGrey};
  font-size: ${props => props.theme.font.size.s14};
  font-family: ${props => props.theme.font.family.normal};
  padding: 5px 10px;
  cursor: pointer;
  user-select: none;
`;

const ListItem = createSelectable<ListItemProps>(
  (props: TSelectableItemProps & ListItemProps) => {
    const { selectableRef, item, selected, rangeSelect } = props;

    const handleSelect = (event: React.MouseEvent) => {
      rangeSelect(item)(event);
    };

    return (
      <StyledListItem
        ref={selectableRef}
        key={item.key}
        id={item.key}
        selected={selected}
        onClick={handleSelect}
      >
        {item.description}
      </StyledListItem>
    );
  },
);

export default ListItem;
