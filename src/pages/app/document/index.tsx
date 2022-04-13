import React, { useEffect } from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useDocument } from '@/commons/contexts/document.context';

export default function DocumentPage() {
  const navigate = useNavigate();
  const { handleDocuments, documents } = useDocument();

  useEffect(() => handleDocuments(), [])

  const goToDocument = (id: string) => {
    navigate(`/app/document/build/${id}`);
  };

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Ativo?</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {documents.map(document => (
              <TableRow key={`document_table_item_${document._id}`} onClick={() => goToDocument(document._id)}>
                <TableCell>{document._id}</TableCell>
                <TableCell>{document.name}</TableCell>
                <TableCell>{document.active}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
