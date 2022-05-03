import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography as Text,
  Paper,
  IconButton,
  Divider,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { ChevronLeftOutlined, VisibilityOutlined, SendOutlined, MoreVertOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useDocument } from '@/commons/contexts/document.context';

import DialogComponent from '@/components/dialog';

export default function EditorHeader() {
  const navigate = useNavigate();

  const { document, saveDocument, publishDocument } = useDocument();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [publishModalIsOpen, setPublishModalIsOpen] = useState<boolean>(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const previewDocument = () => {
    handleClose();
    window.open(`/app/document/${document?._id}/preview`);
  };

  const handlePublishDocument = () => {
    handleClose();
    setPublishModalIsOpen(true);
  };
  
  return (
    <Box zIndex={1} position={'fixed'} width={'100%'}>
      <Paper elevation={2}>
        <Box bgcolor={'white'} padding={2}>
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              gap={3}
            >
              <Stack>
                <IconButton
                  onClick={() => navigate('/app/document')}
                >
                  <ChevronLeftOutlined />
                </IconButton>
              </Stack>
              <Divider orientation="vertical" flexItem />
              <Stack>
                <Text>{document?.name} <small>(v{document?.version})</small></Text>
              </Stack>
            </Stack>

            <Stack flexDirection={'row'} gap={3} alignItems={'center'}>
              <Stack>
                <Text color={'text.secondary'}>Últimas mudanças salvas em {document?.updated_at}</Text>
              </Stack>

              <Stack>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={saveDocument}
                >
                  Salvar
                </Button>
              </Stack>

              <Stack>
                <IconButton
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MoreVertOutlined />
                </IconButton>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={previewDocument}
                    href={`/app/document/${document?._id}/preview`}
                    target="_blank"
                  >
                    <ListItemIcon><VisibilityOutlined /></ListItemIcon>
                    <ListItemText>Pré-Visualizar</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handlePublishDocument}>
                    <ListItemIcon>
                      <SendOutlined color={'success'} style={{ transform: 'rotate(-25deg)', marginTop: '-5px' }} />
                    </ListItemIcon>
                    <ListItemText>Publicar</ListItemText>
                  </MenuItem>
                </Menu>
              </Stack>
            </Stack>
          </Stack>

          <DialogComponent
            isOpen={publishModalIsOpen}
            changeState={setPublishModalIsOpen}
            title="Publicar Documento"
            description="Ao publicar um documento todas as alterações ficarão visíveis para preechimento. Tem certeza que deseja continuar?"
            confirmCallback={publishDocument}
          />
        </Box>
      </Paper>
    </Box>
  );
}