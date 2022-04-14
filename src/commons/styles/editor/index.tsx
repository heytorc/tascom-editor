import styled from 'styled-components';
import { Button, Typography, TextField, Switch, Checkbox } from '@mui/material';
import { blue } from '@mui/material/colors';

export const ElementTypeButton = styled(Button)`
  justify-content: flex-start;
  border: 1px solid #eee;
  background: #fcfcfc;
  padding: .8rem;
  border-radius: .6rem
`;

export const EditorLabel = styled(Typography)`
  & p, & ul, & ol {
    margin: 0;
  }
`;

export const EditorBuildInputText = styled(TextField)`
  cursor: pointer;
  
  & input, & textarea {
    cursor: pointer;
  }

  &.inputSelected input, &.inputSelected textarea {
    cursor: move;
  }
`;

export const EditorBuildSwitch = styled(Switch)`
  cursor: pointer;

  & .MuiSwitch-switchBase:not(.Mui-checked) {
    color: ${blue[100]};
  }
  
  & span {
    cursor: pointer;
  }

  &.inputSelected span, &.inputSelected label {
    cursor: move;
  }
`;

export const EditorBuildCheckbox = styled(Checkbox)`
  cursor: pointer;

  & span, & label {
    cursor: move;
  }
`;