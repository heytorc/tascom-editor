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
  ListItemIcon,
} from '@mui/material';
import { ChevronLeftOutlined, VisibilityOutlined, SendOutlined, MoreVertOutlined, DeleteOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useDocument } from '@/commons/contexts/document.context';

import DialogComponent from '@/components/dialog';

export default function EditorHeader() {
  const navigate = useNavigate();

  const { document, saveDocument, publishDocument, currentVersion, deleteVersion } = useDocument();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [publishModalIsOpen, setPublishModalIsOpen] = useState<boolean>(false);
  const [deleteVersionModalIsOpen, setDeleteVersionModalIsOpen] = useState<boolean>(false);

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

  const handleOpenDeleteDocumentVersionModal = () => {
    handleClose();
    setDeleteVersionModalIsOpen(true);
  };

  const handleDeleteDocumentVersion = () => {
    try {
      deleteVersion();
      navigate(`/app/document/build/${document?._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveDocument = async () => {
    const documentData = await saveDocument();

    if (documentData) {
      const buildingVersion = documentData.versions.find(item => item.status === 'building');

      if (buildingVersion)
        navigate(`/app/document/build/${document?._id}?version=${buildingVersion.number}`);
    }

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
                  onClick={handleSaveDocument}
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
                  <MenuItem
                    disabled={!(currentVersion && currentVersion?.status === 'building')}
                    onClick={handlePublishDocument}
                  >
                    <ListItemIcon>
                      <SendOutlined color={'success'} style={{ transform: 'rotate(-25deg)', marginTop: '-5px' }} />
                    </ListItemIcon>
                    <ListItemText>Publicar</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    disabled={!(currentVersion && currentVersion?.status === 'building')}
                    onClick={handleOpenDeleteDocumentVersionModal}
                  >
                    <ListItemIcon>
                      <DeleteOutline color={'error'} />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ color: 'error' }}>Excluir</ListItemText>
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

          <DialogComponent
            isOpen={deleteVersionModalIsOpen}
            changeState={setDeleteVersionModalIsOpen}
            title="Excluir Versão"
            description={`Tem certeza que deseja excluir a versão ${currentVersion?.number} deste documento? Depois de realizada ESTA OPERAÇÃO NÃO PODERÁ SER DESFEITA!`}
            confirmCallback={handleDeleteDocumentVersion}
          />
        </Box>
      </Paper>
    </Box>
  );
}