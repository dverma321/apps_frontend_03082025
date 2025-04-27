import React from 'react';
import TranslateTable from './TranslateTable';
import Clauses from './Clauses';

export const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <Clauses />
      </div>
      <div style={{ flex: 3, overflowY: 'auto', padding: '1rem' }}>
      <TranslateTable />
      </div>
    </div>
  );
};
