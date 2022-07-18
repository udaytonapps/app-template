/** Types that can be shared across any learning apps */

import { AlertColor, SnackbarProps } from "@mui/material";

export type CraEnvironment = "pre_build" | "local_build" | "deployed_build";
export interface LtiSessionConfig {
  apiUrl: string;
  sessionId: string;
}

export interface DecoratedWindow extends Window {
  appConfig?: {
    sessionId: string;
  };
}

export interface LtiAppInfo {
  apiUrl: string;
  contextId: string;
  isInstructor: boolean;
  linkId: string;
  sessionId: string;
  username: string;
  darkMode?: boolean;
  baseColor?: string;
}
export interface SnackbarOptions extends SnackbarProps {
  type: AlertColor;
}

type ApiStatus = "success" | "error";
export interface ApiResponse {
  status: ApiStatus;
  data: unknown;
}

export interface GetInfoResponse extends ApiResponse {
  data: LtiAppInfo;
}

// Table, Filters, Sorting

export type GeneralTableRow = Record<any, any>;
export interface TableHeader {
  label: string;
  fieldKey: string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  width?: number | string;
}

export type SortOrder = "asc" | "desc";

export interface FilterConfig {
  /** The column that is being filtered */
  column: string;
  /** The values to be shown in the filter options (only applies for enum at this point) */
  label: string;
  /** Enum is still assumed to be text, but allows checkboxes for each value in the filter options */
  type: "enum" | "text" | "number";
  /** Optional function to sort the data in a particular way (if not included, will be alpha) */
  sort?: (a: string, b: string) => 1 | 0 | -1;
  /** Optional function to map the label value to another value (such as a display name) */
  valueMapping?: (val: any) => any;
}
