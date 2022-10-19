import { Box, Stack, Typography as Text, Paper } from "@mui/material";
import {
  DateRangeOutlined,
  LooksOneOutlined,
  TextFieldsOutlined,
  WrapTextOutlined,
  ShortTextOutlined,
  CheckBoxOutlined,
  ToggleOnOutlined,
  RadioButtonCheckedOutlined,
  ArrowDropDownCircleOutlined,
  LinearScaleOutlined,
  ImageRounded
} from '@mui/icons-material';

import { useDocument } from "@/commons/contexts/document.context";

import { ElementTypeButton } from "@/commons/styles/editor";

export default function EditorElements() {

  const { createField } = useDocument();

  return (
    <Paper elevation={2}>
      <Box
        bgcolor={'white'}
        width={'20rem'}
        paddingX={5}
        paddingTop={12}
        style={{ overflowX: 'hidden' }}
        height={'100vh'}
      >
        <Stack>
          <Stack>
            <Text>Elementos de Texto</Text>

            <Stack
              flex={1}
              flexDirection={'row'}
              flexWrap={'wrap'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={2}
              marginY={3}
            >

              <ElementTypeButton
                color="primary"
                onClick={() => createField('text')}
                startIcon={<ShortTextOutlined />}
                fullWidth
              >
                Texto
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('textarea')}
                startIcon={<WrapTextOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Caixa de Texto
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('label')}
                startIcon={<TextFieldsOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Label
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('number')}
                startIcon={<LooksOneOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Número
              </ElementTypeButton>

            </Stack>

            <Text>Imagens</Text>

            <Stack
              flex={1}
              flexDirection={'row'}
              flexWrap={'wrap'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={2}
              marginY={3}
            >
              <ElementTypeButton
                color="primary"
                onClick={() => createField('image')}
                startIcon={<ImageRounded />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Imagem
              </ElementTypeButton>
            </Stack>

            <Text>Elementos de Data</Text>

            <Stack
              flex={1}
              flexDirection={'row'}
              flexWrap={'wrap'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={2}
              marginY={3}
            >
              <ElementTypeButton
                color="primary"
                onClick={() => createField('date')}
                startIcon={<DateRangeOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Data
              </ElementTypeButton>
            </Stack>

            <Text>Elementos de Seleção</Text>

            <Stack
              flex={1}
              flexDirection={'row'}
              flexWrap={'wrap'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={2}
              marginY={3}
            >
              <ElementTypeButton
                color="primary"
                onClick={() => createField('checkbox')}
                startIcon={<CheckBoxOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Multipla Escolha
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('yesOrNot')}
                startIcon={<ToggleOnOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Sim/Não
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('radio')}
                startIcon={<RadioButtonCheckedOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Radio
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('select')}
                startIcon={<ArrowDropDownCircleOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Seleção
              </ElementTypeButton>

              <ElementTypeButton
                color="primary"
                onClick={() => createField('range')}
                startIcon={<LinearScaleOutlined />}
                style={{ justifyContent: 'flex-start' }}
                fullWidth
              >
                Intervalo
              </ElementTypeButton>
            </Stack>
            
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}