import { Box, Stack, Typography, Divider, Button } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";

import { useDocument } from "@/commons/contexts/document.context";

import IField from "@/commons/interfaces/IField";

interface IElementFieldsProps {
  fields: IField[],
  setFields: React.Dispatch<React.SetStateAction<IField[]>>
}

export default function EditorElements({ fields, setFields }: IElementFieldsProps) {

  const { createField, saveDocument } = useDocument();

  return (
    <Box
      bgcolor={'white'}
      height={'100vh'}
      paddingX={10}
    >
      <Stack>
        <Box>
          <Typography variant="h4">Elementos</Typography>
        </Box>

        <Divider />

        <Stack>
          <Button
            color="primary"
            onClick={() => createField('text')}
          >
            Texto
          </Button>
          <Button
            color="primary"
            onClick={() => createField('date')}
          >
            Data
          </Button>
          <Button
            color="primary"
            onClick={() => createField('number')}
          >
            Número
          </Button>
          <Button
            color="primary"
            onClick={() => createField('textarea')}
          >
            Caixa de Texto
          </Button>
          <Button
            color="primary"
            onClick={() => createField('label')}
          >
            Label
          </Button>
        </Stack>

        <Divider />

        <Stack>
          <Button
            startIcon={<SaveIcon />}
            color="success"
            variant="contained"
            onClick={saveDocument}
          >
            Salvar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}