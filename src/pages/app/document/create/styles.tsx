import styled from "styled-components";
import { Stack } from '@mui/material';

interface IDocumentContainer {
  width?: number;
  height?: number;
}

export const DocumentContainer = styled(Stack)<IDocumentContainer>`
  display: flex;
  flex: 1;

  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
    /* transform: scale(.9, .98); */
  }

  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    /* transform: scale(.9, .98); */
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    /* transform: scale(.9, .98); */
  }

  /* Large devices (laptops/desktops, 992px and up) */
  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) and (min-width: 992px) {
    /* width: ${props => `${props.width}`};
    height: ${props => `${props.height}`}; */
  }
`;