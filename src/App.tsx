import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { DocumentProvider } from './commons/contexts/document.context';

import LoginPage from "@/pages/login";
import AppPage from "@/pages/app";

import BuildDocument from "@/pages/app/document/build";
import CreateDocument from "@/pages/app/document/create";
import PreviewDocument from "@/pages/app/document/preview";

import './App.css'

function App() {
  return (
    <Router>
      <DocumentProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="app">
            <Route path="/" element={<AppPage />} />
            <Route path="document">
              <Route path="build" element={<BuildDocument />}>
                <Route path=":record_id" element={<BuildDocument />} />
              </Route>
              <Route path=":id/create/:record_id" element={<CreateDocument />} />
              <Route path=":id/preview" element={<PreviewDocument />}>
                <Route path=":record_id" element={<PreviewDocument />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </DocumentProvider>
    </Router>
  )
}

export default App
