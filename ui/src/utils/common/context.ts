import { createContext, Dispatch, SetStateAction } from "react";
import { AppInfo } from "../types";
import { SnackbarOptions } from "./types";

export const AppContext = createContext<AppInfo>({
  apiUrl: "",
  contextId: "",
  isInstructor: false,
  linkId: "",
  sessionId: "",
  username: "",
  darkMode: false,
  baseColor: "",
});

export const SnackbarContext = createContext<{
  get: SnackbarOptions;
  set: Dispatch<SetStateAction<SnackbarOptions>>;
}>({
  get: {
    type: "info",
  },
  set: () => {},
});
