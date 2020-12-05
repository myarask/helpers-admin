import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    maxHeight: 500,
    overflow: 'auto',
  },
  pending: {
    backgroundColor: theme.palette.primary.light,
  },
  tableCell: {
    fontSize: 16,
  },
}));

const formatCell = (row, key, props) => {
  if (key === 'manageButton') {
    return (
      <Button
        onClick={() => props.onManageClick(row)}
        color="primary"
        size="small"
        variant="contained"
      >
        Manage
      </Button>
    );
  }

  return row[key];
};

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const { keyPairs, data } = props;

  return (
    <Paper>
      <div className={classes.tableWrapper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {Object.keys(keyPairs).map((key) => (
                <TableCell key={key} align="left">
                  <Typography variant="h4">{props.keyPairs[key]}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow
                onClick={() => props.onRowClick(row)}
                role="checkbox"
                tabIndex={-1}
                key={row.name}
              >
                {Object.keys(props.keyPairs).map((key, cellIndex) => (
                  <TableCell
                    key={String(rowIndex) + String(cellIndex)}
                    align="left"
                    className={classes.tableCell}
                  >
                    {formatCell(row, key, props)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

StickyHeadTable.defaultProps = {
  keyPairs: {},
  data: [],
  onRowClick: () => null,
  onManageClick: () => null,
};
