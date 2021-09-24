// THIS IS THE ENTRY POINT FOR ALL FRONT END CODE
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from './components';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.querySelector('#app'),
);
