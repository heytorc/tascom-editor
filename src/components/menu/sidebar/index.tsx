import React, { useEffect, useState } from 'react'
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { ArticleOutlined as DocumentIcon } from '@mui/icons-material';

import { IMenu } from '@/commons/interfaces/menu/IMenu';

import { LinkComponent } from '@/commons/styles/texts';

export default function Sidebar() {
  const drawerWidth = 240;

  useEffect(() => {
    setOptions([
      { title: 'Documentos', icon: <DocumentIcon />, route: '/app/document' }
    ])
  }, []);

  const [options, setOptions] = useState<IMenu[]>([]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {options.map((item, index) => (
            <LinkComponent key={`sidebar_item_${index}`} href={item.route}>
              <ListItem button key={index}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </LinkComponent>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}
