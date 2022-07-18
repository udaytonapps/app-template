import { Box, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { Dispatch, MouseEvent, SetStateAction } from "react";
import { SortOrder } from "../../utils/common/types";

interface TableHeaderSortProps {
  column: string;
  columnLabel: string;
  order: SortOrder;
  orderBy: any;
  setOrder: Dispatch<SetStateAction<SortOrder>>;
  setOrderBy: Dispatch<SetStateAction<any>>;
}

/** Sorts data from the header of a table */
function TableHeaderSort(props: TableHeaderSortProps) {
  const { column, columnLabel, order, orderBy, setOrder, setOrderBy } = props;

  const handleRequestSort = (event: MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property: any) => (event: MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };
  return (
    <TableSortLabel
      active={orderBy === column}
      direction={orderBy === column ? order : "asc"}
      onClick={createSortHandler(column)}
    >
      {columnLabel}
      {orderBy === column ? (
        <Box component="span" sx={visuallyHidden}>
          {order === "desc" ? "sorted descending" : "sorted ascending"}
        </Box>
      ) : null}
    </TableSortLabel>
  );
}

export default TableHeaderSort;
