import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { DocumentProvider } from './commons/contexts/document.context';

import './App.css'
import CreateDocument from "./pages/document/create";

function App() {
  return (
    <Router>
      <DocumentProvider>
        <Routes>
          <Route path="/document/create" element={<CreateDocument />} />
        </Routes>
      </DocumentProvider>
    </Router>
  )
}

export default App
