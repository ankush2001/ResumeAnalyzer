import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders App without crashing', () => {
  const { baseElement } = render(React.createElement(App));
  expect(baseElement).toBeInTheDocument();
});
