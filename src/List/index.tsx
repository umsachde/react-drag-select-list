/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Component } from 'react';
import { SelectableGroup } from './SelectableGroup';
import Icon, { IconColor, IconSize, IconType } from './Icon/Icon';
import ListItem, { ListItemProps } from './ListItem/ListItem';
import {
  TSelectableItem,
  TSelectableItemProps,
} from './SelectableGroup/Selectable.types';
import { ErrorContainerStyle, ErrorTextStyle, ListLoadingOverlayStyle } from './utils/constants';
import ListContainer from './hoc/ListContainer';
import { renderLoadingSpinner } from './LoadingSpinner/LoadingSpinner';

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

interface ListState {
  selectableGroupRef:SelectableGroup| null;
  selectedItems: ListOption[]
}

class List extends Component<ListProps> {

  state:ListState = { 
    selectedItems: this.props.initialSelectedItems || [],
    selectableGroupRef: null
  };

  constructor(props: ListProps) {
    super(props)
  }

  static defaultProps = {
    items: [],
    initialSelectedItems: [],
    filterParameter: '',
    error: '',
    isLoading: false,
    handleSelectedItems: null,
    multiSelect: false,
    useV2Selection: false,
  }

  onKeyDownEventListener = (event: KeyboardEvent) => {
    if ((event.key === 'a' || event.key === 'A') && event.ctrlKey) {
      const {items, handleSelectedItems} = this.props;
      this.setState({selectedItems: items});
      handleSelectedItems(items);
      this.state.selectableGroupRef?.selectAll();
    }
  };

  clearSelections = () => {
    if (this.state.selectableGroupRef) {
      this.state.selectableGroupRef.clearSelection();
      for (const item of this.state.selectableGroupRef.registry.values()) {
        item.setState({ isSelected: false, isSelecting: false });
      }
      this.state.selectableGroupRef.lastClickedReference = -1;
    }
    this.setState({selectedItems: []});
  };

  getSelectableGroupRef = (ref: SelectableGroup | null) => {
    if(this.state) {

      this.setState({selectableGroupRef: ref})
    }
  };

  getItemsFromRange = (
    start: number,
    end: number,
  ): IndexedListOption[] => {
    const { items } = this.props;
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

  handleSelectionFinish = (newSelectedItems: ListHandlerType[]) => {
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
    this.props.handleSelectedItems(newSelectionState);
    this.setState({selectedItems: newSelectionState});
  };

  getSelectionItems = (
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
          ...this.getItemsFromRange(
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

  selectRange = (item: IndexedListOption) => {
  return(
    event: React.MouseEvent,
  ) => {
    const {selectableGroupRef, selectedItems} = this.state;
    const { items } = this.props;
    const selectionDirection =
      selectableGroupRef &&
      selectableGroupRef.lastClickedReference >= 0 &&
      selectableGroupRef.lastClickedReference > item.itemIndex
        ? ShiftSelectionDirection.UP
        : ShiftSelectionDirection.DOWN;

    const { itemsToSelect, itemsToUnselect } = event.shiftKey
      ? this.getSelectionItems(
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
  }
};

isItemSelected = (item: ListOption) => {
  return (
    this.state.selectedItems.filter(selectedItem => selectedItem.key === item.key)
      .length > 0
  );
};

addItemToList = (item: ListOption, itemIndex: number) => {
  const { filterParameter } = this.props;
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
        selected={this.isItemSelected(item)}
        rangeSelect={this.selectRange}
      />
    );
  }

  return null;
};

renderError = () => {
  if (!this.props.error) {
    return null;
  }
  return (
    <div style={ErrorContainerStyle}>
      <Icon
        type={IconType.AlertTriangle}
        width={IconSize.s13}
        height={IconSize.s13}
        color={IconColor.Red}
      />
      <p style={ErrorTextStyle}>{this.props.error}</p>
    </div>
  );
};

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDownEventListener);
  }

  componentDidUpdate(prevProps:ListProps) {
    const {
      useV2Selection,
      multiSelect,
      items,
      resetList,
      initialSelectedItems
    } = this.props;
    const { selectedItems } = this.state;

    if (prevProps.items !== this.props.items) {
      if (useV2Selection && multiSelect && items && items.length > 0) {
        document.addEventListener('keydown', this.onKeyDownEventListener);
      }
    }

    if(prevProps.resetList !== this.props.resetList) {
      if (typeof resetList === 'boolean' && resetList) {
        this.clearSelections();
      }
    }

    if(prevProps.initialSelectedItems !== this.props.initialSelectedItems) {
      if (
        initialSelectedItems &&
        initialSelectedItems.length === 0 &&
        selectedItems.length > 0
      ) {
        this.clearSelections();
      }
    }
  }

  render () {
    const {
      items,
      error,
      isLoading
    } = this.props;

    return (
      <SelectableGroup
        ref={this.getSelectableGroupRef}
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
        onSelectionFinish={this.handleSelectionFinish}
      >
        <ListContainer
          customClassName={'list-container'}
          error={!!error}
          isLoading={!!isLoading}
        >
          {items.map((item: ListOption, itemIndex) =>
            this.addItemToList(item, itemIndex),
          )}
          {isLoading ? (
            <>
              <div style={ListLoadingOverlayStyle} />
              {renderLoadingSpinner()}
            </>
          ) : null}
        </ListContainer>
        {this.renderError()}
      </SelectableGroup>
    );
  }
};

export default List;
