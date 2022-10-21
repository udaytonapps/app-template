import {
  Box,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./App.scss";
import DevPanel from "./components/common/DevPanel";
import { getInfo } from "./utils/api-connector";
import { AppContext, SnackbarContext } from "./utils/common/context";
import { getAppConfig, getEnvironment } from "./utils/common/helpers";
import { useAppTheme } from "./utils/common/theme";
import { LtiAppInfo, SnackbarOptions } from "./utils/common/types";
import Main from "./views/Main";

function App() {
  const [appConfig, setAppconfig] = useState<LtiAppInfo>();
  const [snackbarOptions, setSnackbarOptions] = useState<SnackbarOptions>({
    type: "info",
    open: false,
  });

  useEffect(() => {
    console.info(`Running in cra environment: ${getEnvironment()}`);
    getInfo().then((info) => {
      if (info) {
        if (typeof info !== "string") {
          console.info(`Application configuration information retrieved`);
          /** Information about the environment used to create the react app */
          const config = getAppConfig(info);
          setAppconfig(config);
        } else {
          console.error("Unable to retrieve App Info - Session may be expired");
        }
      }
    });
  }, []);

  /** Theme customizations */
  const theme = useAppTheme({
    baseColor: appConfig?.baseColor,
    darkMode: appConfig?.darkMode,
  });

  const getSnackBarAlert = () => {
    return (
      <Alert severity={snackbarOptions.type}>{snackbarOptions.message}</Alert>
    );
  };

  const defaultSnackbarOptions: Partial<SnackbarOptions> = {
    anchorOrigin: {
      vertical: "top",
      horizontal: "right",
    },
    autoHideDuration: 4000,
    open: snackbarOptions.open === false ? false : true,
    onClose: () => {
      setSnackbarOptions({
        type: snackbarOptions.type,
        message: snackbarOptions.message,
        open: false,
      });
    },
  };
  const combinedOps = {
    ...defaultSnackbarOptions,
    ...snackbarOptions,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Snackbar {...combinedOps}>{getSnackBarAlert()}</Snackbar>
        <SnackbarContext.Provider
          value={{ get: snackbarOptions, set: setSnackbarOptions }}
        >
          {appConfig && (
            <AppContext.Provider value={appConfig}>
              <Box display={"flex"} className="App-header">
                <Main />
              </Box>
            </AppContext.Provider>
          )}
        </SnackbarContext.Provider>
      </div>
      {/* Only show dev panel for local development */}
      {["pre_build", "local_build"].includes(getEnvironment()) && <DevPanel />}
    </ThemeProvider>
  );
}

export default App;
