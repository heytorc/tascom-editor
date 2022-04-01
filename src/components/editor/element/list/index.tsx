import { Box, Heading, VStack, Button, Divider } from "@chakra-ui/react";
import { DownloadIcon } from '@chakra-ui/icons';

import { useDocument } from "@/commons/contexts/document.context";

import IField from "@/commons/interfaces/IField";

interface IElementFieldsProps {
  fields: IField[],
  setFields: React.Dispatch<React.SetStateAction<IField[]>>
}

export default function EditorElements({ fields, setFields }: IElementFieldsProps) {

  const { createField, saveDocument } = useDocument();

  return (
    <Box bg={'white'} h={'100vh'} paddingX={10}>
      <VStack>
        <Box>
          <Heading>Elementos</Heading>
        </Box>

        <Divider />

        <VStack>
          <Button
            colorScheme='teal'
            variant='ghost'
            onClick={() => createField('text')}
            isFullWidth
          >
            Texto
          </Button>
          <Button
            colorScheme='teal'
            variant='ghost'
            onClick={() => createField('date')}
            isFullWidth
          >
            Data
          </Button>
          <Button
            colorScheme='teal'
            variant='ghost'
            onClick={() => createField('number')}
            isFullWidth
          >
            Número
          </Button>
          <Button
            colorScheme='teal'
            variant='ghost'
            onClick={() => createField('textarea')}
            isFullWidth
          >
            Caixa de Texto
          </Button>
          <Button
            colorScheme='teal'
            variant='ghost'
            onClick={() => createField('label')}
            isFullWidth
          >
            Label
          </Button>
        </VStack>

        <Divider />

        <VStack>
          <Button
            leftIcon={<DownloadIcon />}
            colorScheme="green"
            variant='solid'
            onClick={saveDocument}
          >
            Salvar
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}