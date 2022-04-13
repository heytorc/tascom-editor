import styled from 'styled-components';
import { Button, Typography, TextField } from '@mui/material';

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