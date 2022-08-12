import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FilterConfig, SortOrder, TableHeader } from "../utils/common/types";
import Filter from "./common/Filter";
import {
  compareLastNames,
  formatDbDate,
  getComparator,
  stableSort,
} from "../utils/common/helpers";
import TableHeaderSort from "./common/TableHeaderSort";
import { TemplateComment } from "../utils/types";

interface CommentsTableProps {
  loading: boolean;
  rows: TemplateComment[];
}

const headers: TableHeader[] = [
  {
    label: "Date",
    fieldKey: "updatedAt",
  },
  {
    label: "Student Name",
    fieldKey: "learnerName",
  },
  {
    label: "Comment",
    fieldKey: "text",
  },
];

const filters: FilterConfig[] = [
  {
    column: "learnerName",
    label: "Learner Name",
    type: "enum",
    sort: compareLastNames,
  },
];

/** Shows the balances of all available students */
function CommentsTable(props: CommentsTableProps) {
  const { loading, rows } = props;
  const [filteredRows, setFilteredRows] = useState(rows);
  const [orderBy, setOrderBy] = useState<keyof TemplateComment>();
  const [order, setOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  /** The filteredRows are automatically sorted each render */
  const sortedFilteredRows = stableSort(
    filteredRows,
    getComparator(order, orderBy)
  );

  return (
    <Box>
      <Box mb={1}>
        <Filter
          buttonLabel="Filters"
          rows={rows}
          filters={filters}
          filterRows={setFilteredRows}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Comments table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={`${header.fieldKey}-header`}
                  align={header.align || "left"}
                  width={header.width || "auto"}
                >
                  <TableHeaderSort
                    column={header.fieldKey}
                    columnLabel={header.label}
                    {...{ order, orderBy, setOrder, setOrderBy }}
                  ></TableHeaderSort>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={headers.length}
                padding={"none"}
                sx={{ border: "none", height: "4px" }}
              >
                {loading && <LinearProgress />}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!sortedFilteredRows.length ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  sx={{ textAlign: "center" }}
                >
                  <Typography>No results</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedFilteredRows.map((row, index) => (
                <TableRow
                  key={`${index}-${row.id}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{formatDbDate(row.createdAt)}</TableCell>
                  <TableCell>{row.learnerName}</TableCell>
                  <TableCell>{row.text}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CommentsTable;
