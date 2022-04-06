import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { DocumentProvider } from './commons/contexts/document.context';

import './App.css'
import CreateDocument from "./pages/document/create";
import PreviewDocument from "./pages/document/preview";

function App() {
  return (
    <Router>
      <DocumentProvider>
        <Routes>
          <Route path="document">
            <Route path="create" element={<CreateDocument />} />
            <Route path=":id/preview" element={<PreviewDocument />} />
            <Route path=":id/preview/:record_id" element={<PreviewDocument />} />
          </Route>
        </Routes>
      </DocumentProvider>
    </Router>
  )
}

export default App
