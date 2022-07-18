import { createContext } from "react";
import { LtiAppInfo } from "./types";

export const AppContext = createContext<LtiAppInfo>({
  apiUrl: "",
  contextId: "",
  isInstructor: false,
  linkId: "",
  sessionId: "",
  username: "",
  darkMode: false,
  baseColor: "",
});
