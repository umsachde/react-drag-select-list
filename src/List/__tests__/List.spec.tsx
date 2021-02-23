import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { List, ListOption } from '../List';
import { theme } from '../utils/constants';

describe('The List Component', () => {
  const mockedItems: ListOption[] = [
    {
      key: 'something',
      description: 'something',
    },
    {
      key: 'newItem',
      description: 'this is new and different',
    },
  ];

  const zoneList: ListOption[] = [
    {
      key: 'fc71ee27-608f-4223-b2ea-2774eb83c6b4',
      description: 'Abbotsford',
    },
    {
      key: 'e3284fa5-8360-449d-b9ae-527ef8226fa5',
      description: 'Airdrie',
    },
    {
      key: 'dbae07a6-73f2-463d-aea6-e8a10ac134f8',
      description: 'Barrie',
    },
    {
      key: '90770c01-62ed-4609-869a-99dc4203567d',
      description: 'Brandon',
    },
    {
      key: '437dd24a-00f8-4840-9b77-e55c7820a334',
      description: 'Brantford',
    },
    {
      key: '6118c099-8a0f-49ce-a752-4d6943be32e9',
      description: 'Brossard',
    },
    {
      key: '504433a3-7c7d-48b9-8b03-8bd84e9c8006',
      description: 'Buffalo',
    },
    {
      key: 'e8c24b62-865b-497a-96df-b7ef566033a5',
      description: 'Calgary - Central East',
    },
    {
      key: '91205c26-f452-4416-892d-0a026c51d6a0',
      description: 'Calgary - Northeast',
    },
    {
      key: '2384',
      description: 'Calgary - Northwest',
    },
    {
      key: 'c19e7211-0096-4d1f-be30-d272d3d512ed',
      description: 'Calgary - South',
    },
  ];

  const props = {
    error: '',
    isLoading: false,
    items: mockedItems,
    filterParameter: '',
    handleSelectedItems: jest.fn(),
    resetList: false,
  };
  let wrapper;

  it('renders list with mocked items', () => {
    wrapper = render(<List {...props} />);
    expect(wrapper.getByText(mockedItems[0].description).innerHTML).toEqual(
      'something',
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('selects item in list', () => {
    wrapper = render(<List {...props} />);
    const { getByText } = wrapper;
    fireEvent.click(getByText(mockedItems[0].description));
    expect(getByText(mockedItems[0].description)).toHaveProperty(
      'selected',
      true,
    );
    expect(getByText(mockedItems[1].description)).toHaveProperty(
      'selected',
      false,
    );
  });

  it('renders loading state', () => {
    wrapper = render(<List {...props} isLoading={true} />);
    const loadingSVG = wrapper.container.getElementsByTagName('svg');
    expect(loadingSVG).toBeDefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders error state', () => {
    wrapper = render(
      <List {...props} error={'We have encountered an error'} />,
    );
    const errorElement = wrapper.findByText('We have encountered an error');
    expect(errorElement).toBeDefined();
  });

  it('does not render item if it doesnt pass filterParameter', () => {
    wrapper = render(<List {...props} filterParameter={'something'} />);
    expect(wrapper.queryByText(mockedItems[0].description)).toBeInTheDocument();
    expect(
      wrapper.queryByText(mockedItems[1].description),
    ).not.toBeInTheDocument();
  });

  describe('Special event handler', () => {
    const defaultBackgroundColor = `background-color: ${theme.colors.white}`;
    const selectedItemBackgroundColor = `background-color: ${theme.colors.lightGrey}`;

    it('select all list items when pressing CTRL + A ', () => {
      const { getByText } = render(
        <List {...props} items={zoneList} useV2Selection multiSelect />,
      );

      zoneList.forEach(zone =>
        expect(getByText(zone.description)).toHaveStyle(defaultBackgroundColor),
      );

      fireEvent.keyDown(document, { key: 'a', code: 'KeyA', ctrlKey: true });

      zoneList.forEach(zone =>
        expect(getByText(zone.description)).toHaveStyle(
          selectedItemBackgroundColor,
        ),
      );
    });

    it('select items by range when user clicks while pressing SHIFT key', () => {
      const { getByText } = render(
        <List {...props} items={zoneList} useV2Selection multiSelect />,
      );

      zoneList.forEach(zone =>
        expect(getByText(zone.description)).toHaveStyle(defaultBackgroundColor),
      );

      const firstElement = getByText('Abbotsford');
      const lastElement = getByText('Brossard');

      fireEvent.click(firstElement, { shiftKey: true });
      fireEvent.click(lastElement, { shiftKey: true });

      // Selected range items
      expect(firstElement).toHaveStyle(selectedItemBackgroundColor);
      expect(getByText('Airdrie')).toHaveStyle(selectedItemBackgroundColor);
      expect(getByText('Barrie')).toHaveStyle(selectedItemBackgroundColor);
      expect(getByText('Brandon')).toHaveStyle(selectedItemBackgroundColor);
      expect(lastElement).toHaveStyle(selectedItemBackgroundColor);

      // Non range selected items
      expect(getByText('Buffalo')).toHaveStyle(defaultBackgroundColor);
      expect(getByText('Calgary - Central East')).toHaveStyle(
        defaultBackgroundColor,
      );
      expect(getByText('Calgary - Northeast')).toHaveStyle(
        defaultBackgroundColor,
      );
      expect(getByText('Calgary - Northwest')).toHaveStyle(
        defaultBackgroundColor,
      );
      expect(getByText('Calgary - South')).toHaveStyle(defaultBackgroundColor);
    });
  });
});
