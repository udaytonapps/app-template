import { AppInfo } from "../types";
import { getSessionId } from "./helpers";
import { CraEnvironment, LtiSessionConfig } from "./types";

/** For use during local development for two reasons.
 * 1. Since you cannot retrieve the sessionId from the react server
 * 2. So you don't have to rely on updating the server to check different scenarios tied to the appInfo
 */
export const APP_INFO_OVERRIDES: Partial<AppInfo> = {
  // apiUrl: "",
  // contextId: "",
  // isInstructor: true,
  // linkId: "",
  // sessionId: "42ed85ddafc30d53a3b672f1f011e23a", // Learner session
  sessionId: "591fa77d4c121eed9cf79149d8b08f57", // Instructor session
  // username: "",
  // darkMode: true,
  // baseColor: "#6B5B95", // DRK PRPL
  baseColor: "#0E4466", // DRK TEAL
  // baseColor: "#FFADAD", // LIGHT SALMON
  // baseColor: "#B3ADFF", // LIGHT BLUE
};

const sessionId = getSessionId();

export const EnvConfig: Record<CraEnvironment, LtiSessionConfig> = {
  pre_build: {
    apiUrl: "/learning-apps/mod/mod-template/api/index.php",
    sessionId: APP_INFO_OVERRIDES.sessionId || "",
  },
  local_build: {
    apiUrl: "/learning-apps/mod/mod-template/api/index.php",
    sessionId,
  },
  deployed_build: {
    apiUrl: "/mod/template/api/index.php",
    sessionId,
  },
};

export const DB_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
