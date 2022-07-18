import axios from "axios";
import { ApiResponse, GetInfoResponse, LtiAppInfo } from "./common/types";
import { EnvConfig } from "./common/constants";
import { getEnvironment } from "./common/helpers";
import {
  TemplateAlert,
  GetCourseAlertsResponse,
  TemplateComment,
  GetCourseCommentsResponse,
} from "./types";

const config = EnvConfig[getEnvironment()];

export const getInfo = async (): Promise<LtiAppInfo | string | null> => {
  try {
    const res = await axios.get<GetInfoResponse>(
      `${config.apiUrl}/info?PHPSESSID=${config.sessionId}`
    );
    return typeof res.data === "string" ? res.data : res.data.data;
  } catch (e) {
    console.error(e);
    if (typeof e === "string") {
      return e;
    } else {
      return null;
    }
  }
};

/** INSTRUCTOR */

export const addAlert = async (alert: TemplateAlert): Promise<void> => {
  try {
    const body = alert;
    await axios.post<ApiResponse>(
      `${config.apiUrl}/instructor/alerts?PHPSESSID=${config.sessionId}`,
      body
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const deleteAlert = async (alertId: string): Promise<void> => {
  try {
    await axios.delete<ApiResponse>(
      `${config.apiUrl}/instructor/alerts/${alertId}?PHPSESSID=${config.sessionId}`
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

/** LEARNER */

export const getCourseAlerts = async (): Promise<TemplateAlert[]> => {
  try {
    const res = await axios.get<GetCourseAlertsResponse>(
      `${config.apiUrl}/learner/alerts?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const addComment = async (comment: TemplateComment): Promise<void> => {
  try {
    const body = comment;
    await axios.post<ApiResponse>(
      `${config.apiUrl}/learner/comments?PHPSESSID=${config.sessionId}`,
      body
    );
    return;
  } catch (e) {
    console.error(e);
    return;
  }
};

export const getCourseComments = async (): Promise<TemplateComment[]> => {
  try {
    const res = await axios.get<GetCourseCommentsResponse>(
      `${config.apiUrl}/learner/comments?PHPSESSID=${config.sessionId}`
    );
    return res.data.data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
};
