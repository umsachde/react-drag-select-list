# React Drag Select List


The [React Drag Select List](https://www.npmjs.com/package/react-drag-select-list) library allows creating a drag and select list, along with selections made via key board shortchuts such as (ctrl + a to select all, shift + click to select multiple items on the list).

## Installation

Using npm:
```shell
$ npm i react-drag-select-list
```
Note: add `--save` if you are using npm < 5.0.0

Import in a React typescript project:
```js
// import List component and ListOption type.
import List, { ListOption } from 'react-drag-select-list';

```

## Usage

```js

// example of using the List Component
      <List
        items={listItems}
        error={error}
        isLoading={isLoading}
        filterParameter={searchParams}
        handleSelectedItems={handleSelectedItems}
        resetList={resetList}
        multiSelect
        initialSelectedItems={selectedItems}
        useV2Selection={useV2Selection}
      />
```

