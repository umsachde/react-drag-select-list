import React, { CSSProperties } from 'react';
import { createSelectable } from '../SelectableGroup';
import { IndexedListOption } from '..';
import { TSelectableItemProps } from '../SelectableGroup/Selectable.types';
import { theme } from '../utils/constants';

export interface ListItemProps {
  item: IndexedListOption;
  selected: boolean;
  rangeSelect: (item: IndexedListOption) => (event: React.MouseEvent) => void;
}

const getItemContainerStyle = (selected: boolean):CSSProperties => ({
  backgroundColor: selected ? theme.colors.lightGrey : theme.colors.white,
  color: theme.colors.darkGrey,
  fontSize: 14,
  padding: '5px 10px',
  cursor: 'pointer',
  userSelect: 'none'
});

const ListItem = createSelectable<ListItemProps>(
  (props: TSelectableItemProps & ListItemProps) => {
    const { selectableRef, item, selected, rangeSelect } = props;

    const handleSelect = (event: React.MouseEvent) => {
      rangeSelect(item)(event);
    };

    const itemContainerStyle = getItemContainerStyle(selected);

    return (
      <div
        ref={selectableRef}
        key={item.key}
        id={item.key}
        style={itemContainerStyle}
        onClick={handleSelect}
      >
        {item.description}
      </div>
    );
  },
);

export default ListItem;
