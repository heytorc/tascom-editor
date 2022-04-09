import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "@/commons/contexts/auth.context";
import { DocumentProvider } from '@/commons/contexts/document.context';

import LoginPage from "@/pages/login";
import AppPage from "@/pages/app";

import BuildDocument from "@/pages/app/document/build";
import CreateDocument from "@/pages/app/document/create";
import PreviewDocument from "@/pages/app/document/preview";

import { AuthMiddleware } from "@/commons/middlewares/auth.middleware";

import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <DocumentProvider>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="app" element={<AuthMiddleware />}>
              <Route index element={<AppPage />} />
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
      </AuthProvider>
    </Router>
  )
}

export default App
