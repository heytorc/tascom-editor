import * as React from 'react';
import {
  Box,
  CssBaseline,
} from '@mui/material';

import Navbar from '@/components/menu/navbar';
import Sidebar from '@/components/menu/sidebar';



export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <Navbar />      

      <Sidebar />

      <Box component="main" sx={{ flex: 1, flexGrow: 1, paddingX: 3, paddingY: 13 }}>
        {children}
      </Box>
    </Box>
  );
}
