import { Box, Stack, Typography as Text, Paper, IconButton, Divider, Button } from '@mui/material';
import { ChevronLeftOutlined, VisibilityOutlined } from '@mui/icons-material';
import { useDocument } from '@/commons/contexts/document.context';

import { useNavigate } from 'react-router-dom';

export default function EditorHeader() {
  const navigate = useNavigate();

  const { document, saveDocument } = useDocument();

  return (
    <Box zIndex={1} position={'relative'}>
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
                <Text>{document?.name}</Text>
              </Stack>
            </Stack>

            <Stack flexDirection={'row'} gap={3} alignItems={'center'}>
              <Stack>
                <Text color={'text.secondary'}>Últimas mudanças salvas em {document?.updated_at}</Text>
              </Stack>
              <Stack>
                <Button
                  type="button"
                  variant="text"
                  color="secondary"
                  href={`/app/document/${document?._id}/preview`}
                  target="_blank"
                  startIcon={<VisibilityOutlined />}
                >
                  Pré-visualizar
                </Button>
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
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}