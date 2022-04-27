import React from 'react'
import { AppBar, Toolbar, Typography, Link } from '@mui/material'

export default function Navbar() {
  return (
    <AppBar position="fixed" sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      background: (theme) => theme.palette.secondary.main
    }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          <Link href={'/app'} color="#fff" style={{ textDecoration: 'none' }}>
            Tascom Editor
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
