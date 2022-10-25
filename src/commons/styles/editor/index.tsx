import styled from 'styled-components';
import { Button, Typography, TextField, Switch, Checkbox, Radio } from '@mui/material';
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
  padding: 0;
  margin: 0;
  
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

export const EditorBuildRadio = styled(Radio)`
  cursor: pointer;

  & span, & label {
    cursor: move;
  }
`;

export const EditorReorderGroup = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const EditorReorderItem = styled.li`
  padding: .8rem;
  border-radius: 6px;
  border: 2px solid #eee;
  margin-bottom: 1rem;
  cursor: move;

  & div.reorder-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
`;

export const EditorImageInput = styled.img`
  width: 100%;
  border-radius: .5rem;
  border: 2px dashed #eee;
  min-height: 10rem;
`;

export const EditorTable = styled.table`
  border-collapse: collapse;

  &, th, td {
    border: 1px solid #aaa;
  }
`