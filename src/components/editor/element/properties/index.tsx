import React, { useState } from 'react';
import {
  Box,
  Stack,
  Typography as Text,
  Button,
  IconButton,
  FormGroup,
  TextField,
  Tab,
  FormControl,
  RadioGroup,
  FormControlLabel,
  List as ListComponent,
  ListItemButton,
  ListItem,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Delete as DeleteIcon,
  DisplaySettingsOutlined,
  Add,
  DeleteOutlineOutlined
} from "@mui/icons-material";
import { GitMerge } from "phosphor-react";
import { List, arrayMove } from 'react-movable';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useDocument } from "@/commons/contexts/document.context";
import useEventListener from "@/commons/hooks/useEventListener";

import DialogComponent from '@/components/dialog';
import VersionBadgeComponent from '@/components/editor/document/version.badge';

import { EditorReorderGroup, EditorReorderItem, EditorBuildRadio, EditorBuildSwitch } from "@/commons/styles/editor";
import { useNavigate } from 'react-router-dom';

export default function ElementProperties() {
  const {
    selectedField,
    updateFieldTag,
    updateFieldLabel,
    updateFieldSize,
    deleteField,
    document,
    currentVersion,
    updateDocumentSize,
    updateFieldPlaceholder,
    addFieldOptions,
    updateFieldOptions,
    deleteFieldOption,
    updateFieldOrientation,
    updateFieldOptionData,
    updateDocumentName,
    toggleActiveDocument,
    toggleRequiredField,
    setTargetVersion,
  } = useDocument();

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<string>('1');
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState<boolean>(false);

  const handleChangeCurrentTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleAddFieldOption = () => {
    const label = selectedField?.options?.length ? `Opção ${selectedField.options.length + 1}` : '';
    const value = selectedField?.options?.length ? `${selectedField.options.length + 1}` : '0';

    addFieldOptions({
      label,
      value,
    })
  };

  const handleDeleteField = (keyCode?: number) => {
    if (keyCode && keyCode === 46) {
      setDeleteModalIsOpen(true);
    }
  };

  useEventListener('keyup', (handler: any) => handleDeleteField(handler.keyCode));

  const handleOpenVersion = (versionNumber: number) => {
    if (document) {
      navigate(`/app/document/build/${document?._id}?version=${versionNumber}`);
      setTargetVersion(versionNumber);
    }
  };

  return (
    <Box
      bgcolor={'white'}
      height={'100vh'}
      width={500}
      paddingTop={12}
      style={{ overflowX: 'hidden' }}
    >
      <Stack>
        <Stack paddingX={2} mb={2} display={'flex'} gap={2} flexDirection={'row'} alignItems={'center'}>
          <DisplaySettingsOutlined color="primary" />
          <Text variant="h6">Propriedades</Text>
        </Stack>

        <DialogComponent
          isOpen={deleteModalIsOpen}
          changeState={setDeleteModalIsOpen}
          title="Remover campo"
          description="Tem certeza que deseja remover este campo?"
          confirmCallback={deleteField}
        />

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={currentTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeCurrentTab} aria-label="lab API tabs example">
                <Tab label="Campo" value="1" />
                <Tab label="Documento" value="2" />
                <Tab label="Versões" value="3" />
              </TabList>
            </Box>

            {/* Field Props */}
            <TabPanel value="1">
              {selectedField && (
                <Stack>

                  {/* Field Description */}
                  <Stack paddingY={1} mb={1}>
                    <Text fontWeight={'bold'} mb={2}>Rótulo:</Text>

                    {selectedField.useRichText ? (
                      <ReactQuill
                        theme="snow"
                        value={selectedField?.label}
                        onChange={updateFieldLabel}
                      />
                    ) : (
                      <TextField
                        onChange={(element) => updateFieldLabel(element.target.value)}
                        name={`${selectedField?.label}-label`}
                        value={selectedField?.label}
                        // multiline={selectedField && selectedField?.label.length > 10}
                        // rows={selectedField && selectedField?.label.length > 10 ? 10 : undefined}
                        size="small"
                      />
                    )}
                  </Stack>

                  {/* Field Tag */}
                  <Stack paddingY={1} mb={1}>
                    <Text fontWeight={'bold'} mb={2}>Identificador:</Text>
                    <TextField
                      onChange={(element) => updateFieldTag(element.target.value)}
                      name={`${selectedField?.tag}-tag`}
                      value={selectedField?.tag}
                      size="small"
                    />
                  </Stack>


                  {/* Field Placeholder */}
                  <Stack paddingY={1} mb={1}>
                    <TextField
                      label="Placeholder"
                      onChange={(element) => updateFieldPlaceholder(element.currentTarget.value)}
                      name={`${selectedField?.label}-placeholder`}
                      value={selectedField?.placeholder}
                      size="small"
                    />
                  </Stack>

                  {/* Field Size */}
                  <Stack paddingY={1} mb={1}>
                    <Text fontWeight={'bold'} marginBottom={2}>Tamanho:</Text>

                    <Stack direction={'row'} gap={2} alignItems={'baseline'}>

                      <TextField
                        label="Largura"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(element) => updateFieldSize({ width: parseInt(element.target.value), height: 0 }, "width")}
                        name={`${selectedField?.label}-size-w`}
                        value={selectedField?.size.width}
                        size="small"
                      />

                      <Text>x</Text>

                      <TextField
                        label="Altura"
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        onChange={(element) => updateFieldSize({ width: 0, height: parseInt(element.target.value) }, "height")}
                        name={`${selectedField?.label}-size-y`}
                        value={selectedField?.size.height}
                        size="small"
                      />

                    </Stack>
                  </Stack>

                  {/* Field Options */}
                  {selectedField?.options && (
                    <Stack paddingY={1} mb={1}>
                      <Stack
                        flexDirection={'row'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                      >
                        <Text fontWeight={'bold'} mb={2}>Opções:</Text>
                        <Button
                          startIcon={<Add />}
                          variant={'contained'}
                          color={'secondary'}
                          onClick={handleAddFieldOption}
                        >
                          Adicionar
                        </Button>
                      </Stack>
                      <List
                        values={selectedField.options}
                        onChange={({ oldIndex, newIndex }) => {
                          if (selectedField.options)
                            updateFieldOptions(arrayMove(selectedField.options, oldIndex, newIndex))
                        }}
                        renderList={({ children, props }) => <EditorReorderGroup {...props}>{children}</EditorReorderGroup>}
                        renderItem={({ value, props, index }) => (
                          <EditorReorderItem {...props}>
                            <div className="reorder-item-content">
                              <TextField
                                label="Nome"
                                size="small"
                                name={`${selectedField?.label}-option-label-${index}`}
                                value={value.label}
                                onChange={({ currentTarget: { value } }) => updateFieldOptionData(index || 0, 'label', value)}
                              />

                              <TextField
                                label="Valor"
                                size="small"
                                name={`${selectedField?.label}-option-value-${index}`}
                                value={value.value}
                                onChange={({ currentTarget: { value } }) => updateFieldOptionData(index || 0, 'value', value)}
                              />

                              <IconButton color={'error'} onClick={() => {
                                if (index)
                                  deleteFieldOption(index);
                              }}>
                                <DeleteOutlineOutlined />
                              </IconButton>
                            </div>
                          </EditorReorderItem>
                        )}
                      />
                    </Stack>
                  )}

                  {/* Field Orientation */}
                  {selectedField?.orientation && (
                    <Stack paddingY={1} mb={1}>
                      <Text fontWeight={'bold'} mb={2}>Orientação:</Text>

                      <Stack>
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            name={`field-${selectedField.tag}-orientation`}
                          >
                            <FormControlLabel
                              control={<EditorBuildRadio color="secondary" />}
                              label={'Coluna'}
                              value={'column'}
                              checked={selectedField?.orientation === 'column'}
                              onChange={() => updateFieldOrientation('column')}
                            />
                            <FormControlLabel
                              control={<EditorBuildRadio color="secondary" />}
                              label={'Linha'}
                              value={'row'}
                              checked={selectedField?.orientation === 'row'}
                              onChange={() => updateFieldOrientation('row')}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Stack>
                    </Stack>
                  )}
                  
                  {/* Field is Required */}
                  {!['yesOrNot', 'label', 'checkbox'].includes(selectedField?.type) && (
                    <Stack>
                      <FormGroup>
                        <FormControlLabel
                          control={(
                            <EditorBuildSwitch
                              checked={selectedField?.required}
                              onChange={(element, checked) => toggleRequiredField(checked)}
                            />
                          )}
                          label={`Obrigatório?`}
                        />
                      </FormGroup>
                    </Stack>
                  )}

                  <Stack display={'flex'} justifyContent={'flex-end'} paddingY={2}>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="contained"
                      onClick={() => setDeleteModalIsOpen(true)}
                    >
                      Excluir
                    </Button>
                  </Stack>
                </Stack>
              )}
            </TabPanel>

            {/* Document Props */}
            <TabPanel value="2">
              <Stack paddingY={1} mb={3}>
                <Text fontWeight={'bold'} marginBottom={2}>Nome do documento:</Text>
                <TextField
                  onChange={(element) => updateDocumentName(element.target.value)}
                  name={`${document?.name}-label`}
                  value={document?.name}
                  // multiline={selectedField && selectedField?.label.length > 10}
                  // rows={selectedField && selectedField?.label.length > 10 ? 10 : undefined}
                  size="small"
                  style={{ marginBottom: '1rem' }}
                />

                <Text fontWeight={'bold'} marginBottom={2}>Tamanho:</Text>

                <Stack direction={'row'} gap={2} marginBottom={2} alignItems={'baseline'}>

                  <TextField
                    label="Largura"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={(element) => updateDocumentSize({ width: parseInt(element.target.value), height: 0 }, "width")}
                    name={`${document?.name}-size-w`}
                    value={document?.size.width}
                    size="small"
                  />

                  <Text>x</Text>

                  <TextField
                    label="Altura"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    onChange={(element) => updateDocumentSize({ width: 0, height: parseInt(element.target.value) }, "height")}
                    name={`${document?.name}-size-y`}
                    value={document?.size.height}
                    size="small"
                  />

                </Stack>

                <Stack>
                  <Text fontWeight={'bold'} marginBottom={2}>Ativo?</Text>

                  <FormGroup>
                    <FormControlLabel
                      control={(
                        <EditorBuildSwitch
                          checked={document?.active}
                          onChange={(element, checked) => toggleActiveDocument(checked)}
                        />
                      )}
                      label={`Ativo?`}
                    />
                  </FormGroup>
                </Stack>
              </Stack>
            </TabPanel>

            {/* Document Versions */}
            <TabPanel value="3">
              <ListComponent>
                {document?.versions.reverse().map((version, index) => (
                  <Stack
                    key={`document_version_${index}`}
                    bgcolor={(theme) => version.number === currentVersion?.number ? theme.palette.secondary.light : ''}
                    mb={2}
                    borderRadius={1}
                  >
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleOpenVersion(version.number)}>
                        <Stack
                          width={'100%'}
                          flexDirection={'row'}
                          alignItems={'center'}
                          justifyContent={'space-between'}
                        >
                          <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
                            <Stack>
                              <GitMerge color={'#337EAD'} size={32} />
                            </Stack>
                            <Stack>
                              <Text><small>Versão:</small> {version.number}</Text>
                              <Text><small>Campos:</small> {version.fields.length}</Text>
                            </Stack>
                          </Stack>
                          <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
                            {document.version === version.number && (
                              <Stack>
                                <VersionBadgeComponent status="current" />
                              </Stack>
                            )}
                            <Stack>
                              <VersionBadgeComponent status={version.status} />
                            </Stack>
                          </Stack>
                        </Stack>
                      </ListItemButton>
                    </ListItem>
                  </Stack>
                ))}
              </ListComponent>
            </TabPanel>
          </TabContext>
        </Box>
      </Stack>
    </Box>
  )
}