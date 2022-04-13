import React, { useState } from 'react';
import { Box, Stack, Typography as Text, Button, IconButton, Divider, TextField, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Close as CloseIcon, Delete as DeleteIcon, DisplaySettingsOutlined, InputOutlined } from "@mui/icons-material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useDocument } from "@/commons/contexts/document.context";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function ElementProperties() {

  const [currentTab, setCurrentTab] = useState<string>('1');

  const handleChangeCurrentTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const {
    selectedField,
    setSelectedField,
    updateFieldLabel,
    updateFieldSize,
    deleteField,
    document,
    updateDocumentSize,
    updateFieldPlaceholder
  } = useDocument();

  return (
    <Box
      bgcolor={'white'}
      height={'90vh'}
      width={500}
      paddingY={2}
    >
      <Stack>
        <Stack padding={2} display={'flex'} gap={2} flexDirection={'row'} alignItems={'center'}>
          <DisplaySettingsOutlined color="primary" />
          <Text variant="h6">Propriedades</Text>
        </Stack>

        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={currentTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeCurrentTab} aria-label="lab API tabs example">
                <Tab label="Campo" value="1" />
                <Tab label="Documento" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {/* Field Props */}
              {selectedField && (
                <Stack>
                  <Stack paddingY={1} mb={3}>
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

                  {selectedField?.placeholder && (
                    <Stack paddingY={1} mb={3}>
                      <TextField
                        label="Placeholder"
                        onChange={(element) => updateFieldPlaceholder(element.currentTarget.value)}
                        name={`${selectedField?.label}-placeholder`}
                        value={selectedField?.placeholder}
                        size="small"
                      />
                    </Stack>
                  )}


                  <Stack paddingY={1} mb={3}>
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

                  <Stack display={'flex'} justifyContent={'flex-end'} paddingY={2}>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="contained"
                      onClick={deleteField}
                    >
                      Excluir
                    </Button>
                  </Stack>
                </Stack>
              )}
            </TabPanel>
            <TabPanel value="2">
              {/* Document Props */}
              <Stack paddingY={1} mb={3}>
                <Text fontWeight={'bold'} marginBottom={2}>Tamanho:</Text>

                <Stack direction={'row'} gap={2} alignItems={'baseline'}>

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
              </Stack>
            </TabPanel>
          </TabContext>
        </Box>
      </Stack>
    </Box>
  )
}