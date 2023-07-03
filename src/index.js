import React from 'react';
import ReactDOM from 'react-dom'

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(props.style.tablePaginationRowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const tableHeaderSx = {
    borderLeft: props.style.columnHeaderBorderLeft || 0,
    borderRight: props.style.columnHeaderBorderRight || 0,
    borderTop: props.style.columnHeaderBorderTop || 0,
    broderBottom: props.style.columnHeaderBorderBottom || 0
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size={props.style.tableSize} aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column) => {
                return (
                  <TableCell
                    key={column.id}
                    align={column.alignTitle}
                    style={{ minWidth: column.minWidth, backgroundColor: props.style.columnHeaderBackgroundColor, fontWeight: '600' }}
                    sx={tableHeaderSx}
                  >
                    {column.label}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={`row${index}`}>
                    {props.columns.map((column) => {
                      const value = row[column.id];
                      const colorKeyId = column.id + '-color'
                      const cellColor = row[colorKeyId] && row[colorKeyId] != 'transparent' ? row[colorKeyId] : ''
                      return (
                        <TableCell key={column.id} align={column.align} sx={{ color: cellColor }}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ backgroundColor: props.style.tablePaginationBackgroundColor + ' !important' }}
        rowsPerPageOptions={[5, 10, 15, 20, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export function renderTable(container, columns, rows, style) {
  ReactDOM.render(
    <StickyHeadTable
      columns={columns}
      rows={rows}
      style={style}
    />
    ,
    container
  )
}