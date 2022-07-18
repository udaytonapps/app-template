import { DateTime } from "luxon";
import {
  APP_INFO_OVERRIDES,
  DB_DATE_TIME_FORMAT,
  EnvConfig,
} from "./constants";
import {
  CraEnvironment,
  DecoratedWindow,
  GeneralTableRow,
  LtiAppInfo,
  SortOrder,
} from "./types";

/** Assembles information about the environment used to create the react app */
export const getAppConfig = (appInfo: LtiAppInfo): LtiAppInfo => {
  const environment = getEnvironment();
  let overrides = {};
  // The client-side configuration will override the server properties, if set
  if (environment === "pre_build") {
    overrides = APP_INFO_OVERRIDES;
  }
  const config: LtiAppInfo = {
    ...appInfo,
    ...EnvConfig[environment],
    ...overrides,
  };
  return config;
};

/** Retrieves the environment variable indicating which environment is active */
export const getEnvironment = (): CraEnvironment => {
  const environment =
    (process?.env.REACT_APP_ENV as CraEnvironment) || "production";
  return environment;
};

/** Gets the sessionId from the browser window (where it is served by the backend) */
export const getSessionId = (): string => {
  const appConfig = (window as DecoratedWindow).appConfig || null;
  return appConfig?.sessionId || "";
};

// SORTING

const compareStrings = (a: string, b: string) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export const compareRowLastNames = (
  a: GeneralTableRow,
  b: GeneralTableRow,
  fieldKey: string
) => {
  return compareLastNames(a[fieldKey].toString(), b[fieldKey].toString());
};

export const compareLastNames = (a: string, b: string) => {
  if (a.includes(",") && b.includes(",")) {
    // Format is "Last, First"
    const splitA = a.split(" ");
    const splitB = b.split(" ");
    const lastA = splitA[0];
    const lastB = splitB[0];
    return lastA === lastB
      ? compareStrings(splitA[splitA.length - 1], splitB[splitB.length - 1])
      : compareStrings(lastA, lastB);
  } else {
    // Format is "First Last"
    const splitA = a.split(" ");
    const splitB = b.split(" ");
    const lastA = splitA[splitA.length - 1];
    const lastB = splitB[splitB.length - 1];
    return lastA === lastB
      ? compareStrings(splitA[0], splitB[0])
      : compareStrings(lastA, lastB);
  }
};

export const compareDateTime = (
  a: GeneralTableRow,
  b: GeneralTableRow,
  fieldKey: string
) => {
  return new Date(b[fieldKey]).getTime() - new Date(a[fieldKey]).getTime();
};

const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = <Key extends keyof GeneralTableRow>(
  order: SortOrder,
  orderBy: Key,
  learnerNameKey?: string
): ((a: GeneralTableRow, b: GeneralTableRow) => number) => {
  if (learnerNameKey && orderBy === learnerNameKey) {
    return order === "desc"
      ? (a, b) => -compareRowLastNames(a, b, learnerNameKey)
      : (a, b) => compareRowLastNames(a, b, learnerNameKey);
  } else {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
};

/** Compatible with IE 11, https://mui.com/material-ui/react-table/ */
export const stableSort = <T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export function formatDbDate(dateString: string, format?: string) {
  return DateTime.fromFormat(dateString, DB_DATE_TIME_FORMAT).toLocaleString(
    DateTime.DATETIME_MED || format
  );
}
