import { useEffect, useState } from 'react'
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { SearchOutlined as SeachIcon, Article as ArticleIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useDocument } from '@/commons/contexts/document.context';
import { LoadingButton } from '@mui/lab';

interface IFormDocument {
  name: string;
}

export default function DocumentPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm<IFormDocument>();

  const { handleDocuments, documents, createDocument, document } = useDocument();

  const [search, setSearch] = useState<string>('');
  const [documentList, setDocumentList] = useState(documents);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  useEffect(() => handleDocuments(), []);
  useEffect(() => setDocumentList(documents), [documents]);

  const handleSearch = (value: string) => setSearch(value);

  const filterDocuments = search.length > 0
    ? documentList.filter(document => document.name.toLowerCase().includes(search))
    : [];

  const goToDocument = (id: string) => {
    navigate(`/app/document/build/${id}`);
  };

  const handleCreateDocument: SubmitHandler<IFormDocument> = async ({ name }) => {
    console.log('errors', errors);
    console.log('name', name);
    // if (data.username === 'admin') setError('username', { message: 'username is invalid', type: 'validate' })
    const documentCreated = await createDocument(name);

    if (documentCreated) navigate(`/app/document/build/${documentCreated._id}`);
    else setError('name', { message: 'Este nome de documento já existe. Por favor, escolha outro.', type: 'validate' });
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

        <Stack flexDirection={'row'} alignItems={'center'}>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={() => setCreateModalIsOpen(true)}
            startIcon={<AddIcon />}
          >
            Novo Documento
          </Button>
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
        <Stack flexDirection={'row'} gap={3}>

          {filterDocuments.length > 0 ? (
            <>
              {filterDocuments.map(document => (
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
                    sx={{ cursor: 'pointer', width: '15rem', height: '13rem' }}
                  >
                    <ArticleIcon fontSize="large" color="secondary" />
                    <Text
                      marginTop={2}
                      variant={'h6'}
                      align={'center'}
                      style={{
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >{document.name}</Text>
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
            </>
          ) : (
            <>
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
                    sx={{ cursor: 'pointer', width: '15rem', height: '13rem' }}
                  >
                    <ArticleIcon fontSize="large" color="secondary" />
                    <Text
                      marginTop={2}
                      variant={'h6'}
                      align={'center'}
                      style={{
                        width: "100%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >{document.name}</Text>
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
            </>
          )}
        </Stack>
      </Box>


      <Dialog
        open={createModalIsOpen}
        onClose={() => setCreateModalIsOpen(!createModalIsOpen)}
        fullWidth
      >
        <form onSubmit={handleSubmit(handleCreateDocument)}>
          <DialogTitle>{"Novo Documento"}</DialogTitle>
          <DialogContent>
            <Stack>
              <FormControl sx={{ mb: 1, mt: 2 }} variant="outlined" fullWidth>
                <InputLabel
                  htmlFor="document-name"
                  error={!!errors.name?.type}
                >
                  Nome do documento
                </InputLabel>
                <OutlinedInput
                  {...register("name", { required: "Digite o nome do documento" })}
                  error={!!errors.name?.type}
                  id="document-name"
                  label="Nome do documento"
                />
              </FormControl>

              {errors.name?.message && (<Text color="error" variant="caption">{errors.name.message}</Text>)}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalIsOpen(false)}>Cancelar</Button>
            <LoadingButton
              type="submit"
              color="secondary"
              loadingPosition="start"
              variant={'contained'}
              loading={isSubmitting}
            >
              Criar
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
