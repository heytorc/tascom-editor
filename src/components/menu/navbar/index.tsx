import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Link, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import { useAuth } from '@/commons/contexts/auth.context';

export default function Navbar() {
  const { logOff } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      background: (theme) => theme.palette.secondary.main,
    }}>
      <Toolbar style={{
        justifyContent: 'space-between'
      }}>
        <Typography variant="h6" noWrap component="div">
          <Link href={'/app'} color="#fff" style={{ textDecoration: 'none' }}>
            Tascom Editor
          </Link>
        </Typography>

        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="primary"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={logOff}>Sair</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  )
}
