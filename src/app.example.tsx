import React from 'react'
import ReactDOM from 'react-dom';
import List from './List'

export default function App() {
    const allItems = [
        { key: '0', description: 'Item 1' },
        { key: '1', description: 'Item 2' },
        { key: '2', description: 'Item 3' },
        { key: '3', description: 'Item 4' },
    ]
    return (
        <div>
            <List 
                items={allItems} 
                handleSelectedItems={() => {}} 
            />
        </div>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
  );
