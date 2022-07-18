import { FilterList } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";

interface FilterProps {
  rows: any[];
  filters: any[];
  filterRows: (rows: any[]) => void;
  buttonLabel?: string;
}

type FilterEnumerableReference = Record<string, Record<string, boolean>>;
type FilterActiveReference = Record<string, Record<string, boolean>>;

/** Filters data */
function Filter(props: FilterProps) {
  const { rows, filters, filterRows, buttonLabel } = props;
  //   const [filteredRows, setFilteredRows] = useState(rows);
  const [enumReference, setEnumReference] = useState<FilterEnumerableReference>(
    {}
  );
  const [activeReference, setActiveReference] = useState<FilterActiveReference>(
    {}
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;
  // No need to enable filters if there are no filters or data
  const disabled = filters.length === 0 || rows.length === 0;

  useEffect(() => {
    // Assemble data for the filter capability
    const newEnumReference: FilterEnumerableReference = {};
    const newActiveReference: FilterActiveReference = {};
    rows.forEach((row) => {
      filters.forEach((filter) => {
        // Add each distinct column/row value to the map
        addReference(newEnumReference, filter.column, row);
        // Set the active state for the rows that are passed in
        addReference(newActiveReference, filter.column, row);
      });
    });
    setActiveReference(newActiveReference);
    setEnumReference(newEnumReference);
  }, [rows, filters]);

  const addReference = (
    reference: FilterEnumerableReference | FilterActiveReference,
    col: any,
    row: any[]
  ) => {
    if (reference[col]) {
      reference[col][row[col]] = true;
    } else {
      reference[col] = {
        [row[col]]: true,
      };
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const handleFilterTextChange = (
  //     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //     col: string
  //   ) => {
  //     console.log(e.target.value);
  //   };

  const toggleCheckbox = (col: string, key: string) => {
    activeReference[col][key] = !activeReference[col][key];
    setActiveReference({ ...activeReference });
    applyFilters();
  };

  const toggleAllCheckbox = (col: string) => {
    let toggle = true;
    const allChecked = allOptionsChecked(col);
    if (allChecked) {
      // Deselect all
      toggle = false;
    } else {
      // Select all
      toggle = true;
    }
    for (let key in activeReference[col]) {
      activeReference[col][key] = toggle;
    }
    setActiveReference({ ...activeReference });
    applyFilters();
  };

  const allOptionsChecked = (col: string) => {
    const keys = Object.keys(activeReference[col]);
    return !keys.find((key) => activeReference[col][key] === false);
  };

  const anyOptionsChecked = (col: string) => {
    const keys = Object.keys(activeReference[col]);
    return !!keys.find((key) => activeReference[col][key] === true);
  };

  //   const handleClickApply = () => {
  //     handleClose();
  //     applyFilters();
  //   };

  const applyFilters = () => {
    let filteredRows: any[] = rows;
    for (const filter of filters) {
      filteredRows = filteredRows.filter((row) => {
        if (filter.type === "enum") {
          const filterOut = !activeReference[filter.column][row[filter.column]];
          if (filterOut) {
            return false;
          }
        }
        return true;
      });
    }
    filterRows(filteredRows);
  };

  const getFilterOptions = (filter: any) => {
    let options = Object.keys(enumReference[filter.column]);
    if (filter.sort) {
      options.sort(filter.sort);
    } else {
      options.sort();
    }
    return options;
  };

  return (
    <Box display={"flex"} justifyContent={"end"}>
      {buttonLabel ? (
        <Button
          disabled={disabled}
          aria-describedby={id}
          endIcon={<FilterList />}
          variant="outlined"
          onClick={handleClick}
        >
          Filters
        </Button>
      ) : (
        <IconButton
          disabled={disabled}
          disableRipple
          aria-describedby={id}
          onClick={handleClick}
        >
          {<FilterList />}
        </IconButton>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box display={"flex"} flexWrap={"wrap"}>
          {filters.map((filter, i) => (
            <Box key={`${filter.column}-${i}`} p={2}>
              <FormLabel>{filter.label}</FormLabel>
              {filter.type === "enum" ? (
                <Box display={"flex"}>
                  {enumReference[filter.column] && (
                    <FormGroup>
                      {/* All or none option */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            color="default"
                            checked={allOptionsChecked(filter.column)}
                            indeterminate={
                              !allOptionsChecked(filter.column) &&
                              anyOptionsChecked(filter.column)
                            }
                            onClick={() => toggleAllCheckbox(filter.column)}
                          />
                        }
                        label={
                          <Typography fontWeight={"bold"}>
                            Select all
                          </Typography>
                        }
                      />
                      {getFilterOptions(filter).map((key, i) => {
                        return (
                          <Box key={`${filter.column}-${i}-${key}`}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  color="default"
                                  checked={
                                    activeReference[filter.column][key] === true
                                  }
                                  onClick={() =>
                                    toggleCheckbox(filter.column, key)
                                  }
                                />
                              }
                              label={
                                filter.valueMapping
                                  ? filter.valueMapping(key)
                                  : key
                              }
                            />
                          </Box>
                        );
                      })}
                    </FormGroup>
                  )}
                </Box>
              ) : (
                <Box>
                  <TextField size="small" type={filter.type} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {/* <Box display={"flex"} justifyContent={"end"} pr={1} pb={1}>
          <Button sx={{ mr: 1 }} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClickApply}>
            Apply
          </Button>
        </Box> */}
      </Popover>
    </Box>
  );
}

export default Filter;
