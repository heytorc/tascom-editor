import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, CssBaseline } from '@mui/material';
import { styled } from "@mui/system";
import { theme as DefaultTheme } from '@/commons/themes/default.theme';

import Image from "@/commons/assets/img/bgTexture.png";

const BodyBackground = styled("div")({
  backgroundImage: `url(${Image})`,
  height: "100vh",
});

import App from './App'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultTheme}>
      <CssBaseline>
        <BodyBackground>
          <App />
        </BodyBackground>
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
