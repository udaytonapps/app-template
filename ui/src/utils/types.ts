/** App-specific types */

import { AlertColor } from "@mui/material";
import { ApiResponse } from "./common/types";

export interface TemplateAlert {
  id: string;
  message: string;
  type: AlertColor;
}

export interface TemplateComment {
  id: string;
  createdAt: string;
  learnerName: string;
  text: string;
  type: AlertColor;
}

// API Interfaces
export interface GetCourseAlertsResponse extends ApiResponse {
  data: TemplateAlert[];
}

// API Interfaces
export interface GetCourseCommentsResponse extends ApiResponse {
  data: TemplateComment[];
}
