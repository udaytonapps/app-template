import { DateTime, Duration } from "luxon";
import { AppInfo } from "../types";
import {
  APP_INFO_OVERRIDES,
  DB_DATE_TIME_FORMAT,
  EnvConfig,
} from "./constants";
import {
  CraEnvironment,
  DecoratedWindow,
  GeneralTableRow,
  SortOrder,
} from "./types";

/** Assembles information about the environment used to create the react app */
export const getAppConfig = (appInfo: AppInfo): AppInfo => {
  const environment = getEnvironment();
  let overrides = {};
  // The client-side configuration will override the server properties, if set
  if (environment === "pre_build") {
    overrides = APP_INFO_OVERRIDES;
  }
  const config: AppInfo = {
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
  return ("" + a).localeCompare(b);
};

export const compareRowLastNames = (a: GeneralTableRow, b: GeneralTableRow) => {
  return compareLastNames(a.learner_name, b.learner_name);
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

export const formatLastCommaFirst = (displayname: string) => {
  const arr = displayname.split(" ");
  if (arr[0] && arr[1]) {
    return `${arr[1]}, ${arr[0]}`;
  } else return arr[0];
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
  orderBy: Key
): ((
  a: GeneralTableRow,
  b: GeneralTableRow
  // a: { [key in Key]: number | string },
  // b: { [key in Key]: number | string }
) => number) => {
  if (orderBy === "learner_name") {
    return order === "desc"
      ? (a, b) => -compareRowLastNames(a, b)
      : (a, b) => compareRowLastNames(a, b);
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

export const generateGoogleCalendarUrl = (
  text: string,
  details: string,
  location: string,
  start: string,
  duration: string
) => {
  const startTime = DateTime.fromFormat(start, DB_DATE_TIME_FORMAT).toFormat(
    "yyyyMMdd'T'hhmmss"
  );
  const endTime = DateTime.fromFormat(start, DB_DATE_TIME_FORMAT)
    .plus(
      Duration.fromObject({
        minutes: Number(duration),
      })
    )
    .toFormat("yyyyMMdd'T'hhmmss");
  const urlParams = new URLSearchParams({
    action: "TEMPLATE",
    dates: `${startTime}/${endTime}`,
    text,
    details,
    location,
    ctz: "America/New_York",
  });
  return `https://calendar.google.com/calendar/event?${urlParams.toString()}`;
};
