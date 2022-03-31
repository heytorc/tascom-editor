import {
  Box,
  Flex,
  Button,
  IconButton,
  Text,
  Divider,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Editable,
  EditablePreview,
  EditableTextarea
} from "@chakra-ui/react";
import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";

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
      bg={'white'}
      h={'100vh'}
      w={300}
      padding={8}
    >
      <Flex justifyContent={'flex-end'}>
        <IconButton
          onClick={() => setSelectedField(undefined)}
          aria-label='Close element config'
          size={'sm'}
          icon={<CloseIcon />}
        />
      </Flex>

      <Divider my={10} />

      <Text fontWeight={'bold'}>Label:</Text>
      <Editable
        defaultValue={selectedField?.label}
        onChange={(value: string) => updateLabel(value)}
      >
        <EditablePreview />
        <EditableTextarea
          onDoubleClick={(element) => element.currentTarget.select()}
        />
      </Editable>

      <br />

      <Text fontWeight={'bold'}>Posição:</Text>

      <NumberInput
        onChange={(value) => updatePosition({ x: parseInt(value), y: 0 }, "x")}
        value={selectedField?.position.x}
      >
        <NumberInputField
          name={`${selectedField?.label}-position-x`}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput
        onChange={(value) => updatePosition({ x: 0, y: parseInt(value) }, "y")}
        value={selectedField?.position.y}
      >
        <NumberInputField
          name={`${selectedField?.label}-position-y`}
          value={selectedField?.position.y}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <br />

      <Text fontWeight={'bold'}>Tamanho:</Text>

      <NumberInput
        onChange={(value) => updateSize({ width: parseInt(value), height: 0 }, "width")}
        value={selectedField?.size.width}
      >
        <NumberInputField
          name={`${selectedField?.label}-size-w`}
          value={selectedField?.size.width}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <NumberInput
        onChange={(value) => updateSize({ width: 0, height: parseInt(value) }, "height")}
        value={selectedField?.size.height}
      >
        <NumberInputField
          name={`${selectedField?.label}-size-h`}
          value={selectedField?.size.height}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>

      <br />

      <Button
        leftIcon={<DeleteIcon />}
        colorScheme="red"
        variant='solid'
        onClick={deleteField}
      >
        Excluir
      </Button>
    </Box>
  )
}