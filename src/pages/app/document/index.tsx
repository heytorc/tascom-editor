import React, { useEffect, useState } from 'react'
import {
  Paper,
  Box,
  Typography as Text,
  Stack,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material'
import { SearchOutlined as SeachIcon, Article as ArticleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '@/commons/contexts/document.context';

export default function DocumentPage() {
  const navigate = useNavigate();

  const { handleDocuments, documents } = useDocument();
  
  const [search, setSearch] = useState<string>('');
  const [documentList, setDocumentList] = useState(documents)

  useEffect(() => handleDocuments(), []);
  useEffect(() => setDocumentList(documents), [documents]);
  useEffect(() => filterDocuments(), [search]);

  const handleSearch = (value: string) => setSearch(value);

  const filterDocuments = () => {
    if (!search.length) {
      setDocumentList(documents);
      return;
    }

    const documentsFilter = documentList.filter(document => document.name.toLowerCase().includes(search));

    setDocumentList(documentsFilter);
  }

  const goToDocument = (id: string) => {
    navigate(`/app/document/build/${id}`);
  };

  return (
    <>
      <Stack
        flex={1}
        flexDirection="row"
        alignItems={'center'}
        justifyContent={'space-between'}
        mb={5}
      >
        <Stack>
          <Text variant="h5" color="secondary">Documentos</Text>
        </Stack>
        <Stack>
          <FormControl
            style={{ background: 'white' }}
            sx={{ m: 1, width: '25ch' }}
            variant="outlined"
            size="small"
          >
            <InputLabel htmlFor="outlined-adornment-password">Pesquisar</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={search}
              onChange={({ currentTarget: { value } }) => handleSearch(value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                  >
                    <SeachIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Stack>
      </Stack>

      <Box>
        <Stack flexDirection={'row'}>
          {documentList.map(document => (
            <Paper
              key={`document_table_item_${document._id}`}
              elevation={3}
              onClick={() => goToDocument(document._id)}
            >
              <Stack
                flex={1}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                padding={3}
                sx={{ cursor: 'pointer', width: '13rem', height: '13rem' }}
              >
                <ArticleIcon fontSize="large" color="secondary" />
                <Text marginTop={2} variant={'h6'}>{document.name}</Text>
                <Text marginBottom={2} variant={'subtitle2'}><small>Versão: {document.version}</small></Text>
                <Chip
                  label={document.active ? "Ativo" : "Inativo"}
                  color={document.active ? "success" : undefined}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </>
  )
}
