import React from 'react';
import './App.css';
import Index from './Index'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Index></Index>
      </BrowserRouter>
    </div>
  );
}

export default App;
