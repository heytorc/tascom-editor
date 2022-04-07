import { Box, Stack, Typography, Button, IconButton, Divider, TextField } from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { useDocument } from "@/commons/contexts/document.context";

export default function ElementProperties() {

  const {
    selectedField,
    setSelectedField,
    updateLabel,
    updatePosition,
    updateSize,
    deleteField
  } = useDocument();

  return (
    <Box
      bgcolor={'white'}
      height={'100vh'}
      width={300}
      padding={8}
    >
      <Box display={'flex'} justifyContent={'flex-end'}>
        <IconButton
          onClick={() => setSelectedField(undefined)}
          size="medium"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box paddingY={2}>
        <Divider />
      </Box>

      <Box paddingY={1}>
        <Typography fontWeight={'bold'}>Label:</Typography>
        {/* <Editable
        defaultValue={selectedField?.label}
        onChange={(value: string) => updateLabel(value)}
      >
        <EditablePreview />
        <EditableTextarea
          onDoubleClick={(element) => element.currentTarget.select()}
        />
      </Editable> */}
        <TextField
          onChange={(element) => updateLabel(element.target.value)}
          name={`${selectedField?.label}-label`}
          value={selectedField?.label}
          multiline={selectedField && selectedField?.label.length > 10}
          rows={selectedField && selectedField?.label.length > 10 ? 10 : undefined}
          size="small"
        />
      </Box>

      <Box paddingY={1}>
        <Typography fontWeight={'bold'} marginBottom={2}>Tamanho:</Typography>

        <Stack direction={'row'} gap={2}>

          <TextField
            label="Largura"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(element) => updateSize({ width: parseInt(element.target.value), height: 0 }, "width")}
            name={`${selectedField?.label}-size-w`}
            value={selectedField?.size.width}
            size="small"
          />

          <TextField
            label="Altura"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={(element) => updateSize({ width: 0, height: parseInt(element.target.value) }, "height")}
            name={`${selectedField?.label}-size-y`}
            value={selectedField?.size.height}
            size="small"
          />

        </Stack>
      </Box>

      <Box paddingY={2}>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          variant="contained"
          onClick={deleteField}
          fullWidth
        >
          Excluir
        </Button>
      </Box>
    </Box>
  )
}