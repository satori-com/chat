import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './app-container';

it('is a basic smoke test', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppContainer />, div);
});
