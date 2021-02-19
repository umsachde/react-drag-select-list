/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SelectableGroup } from '../SelectableGroup';
import { getAlphaColor } from '../../../assets/styles/theme/styled-components/DefaultTheme';
import { renderLoadingSpinner } from '../loadingSpinner';
import Icon, { IconColor, IconSize, IconType } from '../Icon';
import ListItem, { ListItemProps } from './ListItem/ListItem';
import {
  TSelectableItem,
  TSelectableItemProps,
} from '../SelectableGroup/Selectable.types';

const ListContainer = styled.div<{ error: boolean; isLoading: boolean }>`
  position: relative;
  border: 1px solid
    ${({ error, theme }) => (error ? theme.colors.red : theme.colors.lightGrey)};
  background-color: ${props => props.theme.colors.white};
  max-height: 474px;
  width: 100%;
  border-radius: 5px;
  overflow-y: ${props => (props.isLoading ? 'hidden' : 'scroll')};
`;

type ListHandlerPropsType = {
  props: TSelectableItemProps & ListItemProps;
};
type ListHandlerType = TSelectableItem & ListHandlerPropsType;

enum ShiftSelectionDirection {
  UP = 'up',
  DOWN = 'down',
}

type SelectionActions = {
  itemsToSelect: ListOption[];
  itemsToUnselect: ListOption[];
};

const ErrorContainer = styled.div`
  display: flex;
  padding-top: 3px;
  align-items: center;
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.red};
  font-size: ${props => props.theme.font.size.s12};
  font-family: ${props => props.theme.font.family.normal};
  margin-left: 7px;
`;

const ListLoadingOverlay = styled.div`
  background-color: ${props => getAlphaColor(props.theme.colors.white, 0.7)};
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export interface ListOption {
  key: string;
  description: string;
}

export interface IndexedListOption extends ListOption {
  itemIndex: number;
}

interface ListProps {
  error?: string;
  isLoading?: boolean;
  items: ListOption[];
  initialSelectedItems?: ListOption[];
  filterParameter?: string;
  handleSelectedItems: (items: ListOption[]) => void;
  resetList?: boolean;
  multiSelect?: boolean;
  useV2Selection?: boolean;
}

export const List: FC<ListProps> = ({
  items,
  initialSelectedItems,
  filterParameter = '',
  error = '',
  isLoading = false,
  handleSelectedItems,
  resetList,
  multiSelect = false,
  useV2Selection = false,
}) => {
  const [selectedItems, setSelectedItems] = useState<ListOption[]>(
    initialSelectedItems || [],
  );
  const [
    selectableGroupRef,
    setSelectableGroupRef,
  ] = useState<SelectableGroup | null>(null);

  const onKeyDownEventListener = (event: KeyboardEvent) => {
    if ((event.key === 'a' || event.key === 'A') && event.ctrlKey) {
      setSelectedItems(items);
      handleSelectedItems(items);
      selectableGroupRef?.selectAll();
    }
  };

  const getSelectableGroupRef = (ref: SelectableGroup | null) => {
    setSelectableGroupRef(ref);
  };

  useEffect(() => {
    if (useV2Selection && multiSelect && items && items.length > 0) {
      document.addEventListener('keydown', onKeyDownEventListener);
    }

    return () => {
      document.removeEventListener('keydown', onKeyDownEventListener);
    };
  }, [items]);

  const getItemsFromRange = (
    start: number,
    end: number,
  ): IndexedListOption[] => {
    const range = [start, end].sort((a, b) => a - b);
    const from = range[0];
    const to = range[1] + 1;

    return items
      .map(({ key, description }: ListOption, index: number) => ({
        key,
        description,
        itemIndex: index,
      }))
      .slice(from, to);
  };

  const handleSelectionFinish = (newSelectedItems: ListHandlerType[]) => {
    const newSelectionState = newSelectedItems.map(
      ({
        props: {
          item: { key, description },
        },
      }) => ({
        key,
        description,
      }),
    );
    handleSelectedItems(newSelectionState);
    setSelectedItems(newSelectionState);
  };

  const getSelectionItems = (
    allSelectedItems: Set<IndexedListOption>,
    shiftIndex: number,
    selectionDirection: ShiftSelectionDirection,
    lastClickedReference: number,
  ): SelectionActions => {
    let itemsToSelect: IndexedListOption[] = [];
    let itemsToUnselect: IndexedListOption[] = [];
    if (Array.from(allSelectedItems).length > 0) {
      const selectedItemsArray = Array.from(allSelectedItems).sort(
        (a: IndexedListOption, b: IndexedListOption) =>
          a.itemIndex - b.itemIndex,
      );
      const isItemIndexMatched = selectedItemsArray.some(
        (item: IndexedListOption) => item.itemIndex === shiftIndex,
      );
      if (isItemIndexMatched) {
        itemsToSelect = [
          ...getItemsFromRange(
            lastClickedReference === -1 ? shiftIndex : lastClickedReference,
            shiftIndex,
          ),
        ];

        itemsToUnselect =
          Array.from([...allSelectedItems, ...itemsToSelect]).filter(
            (a: IndexedListOption) => {
              if (selectionDirection === ShiftSelectionDirection.DOWN) {
                return (
                  a.itemIndex > shiftIndex || a.itemIndex < lastClickedReference
                );
              } else {
                return (
                  a.itemIndex < shiftIndex || a.itemIndex > lastClickedReference
                );
              }
            },
          ) || [];
      }
    }
    return {
      itemsToSelect,
      itemsToUnselect,
    };
  };

  const selectRange = (item: IndexedListOption) => (
    event: React.MouseEvent,
  ) => {
    const selectionDirection =
      selectableGroupRef &&
      selectableGroupRef.lastClickedReference >= 0 &&
      selectableGroupRef.lastClickedReference > item.itemIndex
        ? ShiftSelectionDirection.UP
        : ShiftSelectionDirection.DOWN;

    const { itemsToSelect, itemsToUnselect } = event.shiftKey
      ? getSelectionItems(
          new Set([
            ...selectedItems.map(
              ({ key, description }: ListOption): IndexedListOption => ({
                key,
                description,
                itemIndex: items.findIndex(
                  (item: ListOption) => item.key === key,
                ),
              }),
            ),
            item,
          ]),
          item.itemIndex,
          selectionDirection,
          selectableGroupRef!.lastClickedReference,
        )
      : { itemsToSelect: [item], itemsToUnselect: [] };

    if (itemsToSelect && itemsToSelect.length <= 1 && selectableGroupRef) {
      selectableGroupRef.lastClickedReference = item.itemIndex;
    }

    const shiftItemsToUnselect = event.shiftKey
      ? []
      : [...selectedItems].filter((selectedItem: ListOption) =>
          itemsToSelect
            ?.map((itemToSelect: ListOption) => itemToSelect.key)
            .includes(selectedItem.key),
        );

    if (selectableGroupRef) {
      selectableGroupRef.selectCustomItems(itemsToSelect || []);
      selectableGroupRef.unselectCustomItems(
        [...shiftItemsToUnselect, ...itemsToUnselect] || [],
      );
    }
  };

  const isItemSelected = (item: ListOption) => {
    return (
      selectedItems.filter(selectedItem => selectedItem.key === item.key)
        .length > 0
    );
  };

  const clearSelections = () => {
    if (selectableGroupRef) {
      selectableGroupRef.clearSelection();
      for (const item of selectableGroupRef.registry.values()) {
        item.setState({ isSelected: false, isSelecting: false });
      }
      selectableGroupRef.lastClickedReference = -1;
    }
    setSelectedItems([]);
  };

  useEffect(() => {
    if (typeof resetList === 'boolean' && resetList) {
      clearSelections();
    }
  }, [resetList]);

  useEffect(() => {
    if (
      initialSelectedItems &&
      initialSelectedItems.length === 0 &&
      selectedItems.length > 0
    ) {
      clearSelections();
    }
  }, [initialSelectedItems]);

  const addItemToList = (item: ListOption, itemIndex: number) => {
    if (
      !filterParameter ||
      (filterParameter &&
        item.description.toLowerCase().includes(filterParameter.toLowerCase()))
    ) {
      const indexedItem: IndexedListOption = { ...item, itemIndex };
      return (
        <ListItem
          key={itemIndex}
          item={indexedItem}
          selected={isItemSelected(item)}
          rangeSelect={selectRange}
        />
      );
    }

    return null;
  };

  const renderError = () => {
    if (!error) {
      return null;
    }
    return (
      <ErrorContainer>
        <Icon
          type={IconType.AlertTriangle}
          width={IconSize.s13}
          height={IconSize.s13}
          color={IconColor.Red}
        />
        <ErrorText>{error}</ErrorText>
      </ErrorContainer>
    );
  };

  return (
    <SelectableGroup
      ref={getSelectableGroupRef}
      className="main"
      clickClassName="tick"
      enableDeselect={true}
      tolerance={0}
      deselectOnEsc={true}
      selectOnClick={false}
      scrollContainer={'.list-container'}
      allowCtrlClick
      allowShiftClick
      ignoreList={['.not-selectable']}
      onSelectionFinish={handleSelectionFinish}
    >
      <ListContainer
        className={'list-container'}
        error={!!error}
        isLoading={isLoading}
      >
        {items.map((item: ListOption, itemIndex) =>
          addItemToList(item, itemIndex),
        )}
        {isLoading ? (
          <>
            <ListLoadingOverlay />
            {renderLoadingSpinner()}
          </>
        ) : null}
      </ListContainer>
      {renderError()}
    </SelectableGroup>
  );
};

export default List;
