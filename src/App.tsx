import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { CookiesProvider } from 'react-cookie';

import { AuthProvider } from "@/commons/contexts/auth.context";
import { DocumentProvider } from '@/commons/contexts/document.context';
import { GlobalProvider } from '@/commons/contexts/global.context';

import LoginPage from "@/pages/login";
import AppPage from "@/pages/app";

import DocumentPage from "@/pages/app/document";
import BuildDocument from "@/pages/app/document/build";
import CreateDocument from "@/pages/app/document/create";
import PreviewDocument from "@/pages/app/document/preview";
import PrintDocument from "@/pages/app/document/print";

import { AuthMiddleware } from "@/commons/middlewares/auth.middleware";

import Layout from '@/components/layout/default';

import SnackbarComponent from "@/components/snackbar";

import './App.css';

function App() {
  return (
    <GlobalProvider>
      <CookiesProvider>
        <SnackbarComponent />
        <Router>
          <AuthProvider>
            <DocumentProvider>
              <Routes>
                <Route index element={<LoginPage />} />
                <Route path="app" element={<AuthMiddleware />}>
                  <Route index element={<Layout><AppPage /></Layout>} />
                  <Route path="document" element={<AuthMiddleware />}>
                    <Route index element={<Layout><DocumentPage /></Layout>} />
                    <Route path="build" element={<BuildDocument />}>
                      <Route path=":record_id" element={<BuildDocument />} />
                    </Route>
                    <Route path=":id/create" element={<CreateDocument />}>
                      <Route path=":record_id" element={<CreateDocument />} />
                    </Route>
                    <Route path=":id/preview" element={<PreviewDocument />}>
                      <Route path=":record_id" element={<PreviewDocument />} />
                    </Route>
                    <Route path=":id/print/:record_id" element={<PrintDocument />} />
                  </Route>
                </Route>
              </Routes>
            </DocumentProvider>
          </AuthProvider>
        </Router>
      </CookiesProvider>
    </GlobalProvider>
  )
}

export default App
