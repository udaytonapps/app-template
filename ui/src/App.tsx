import {
  Box,
  ThemeProvider,
  CssBaseline,
  // Snackbar,
  // Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./App.scss";
import DevPanel from "./components/common/DevPanel";
import { getInfo } from "./utils/api-connector";
import { AppContext } from "./utils/common/context";
import { getAppConfig, getEnvironment } from "./utils/common/helpers";
import { useAppTheme } from "./utils/common/theme";
import { LtiAppInfo } from "./utils/common/types";
import Main from "./views/Main";

function App() {
  const [appConfig, setAppconfig] = useState<LtiAppInfo>();

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

  // const getSnackBarAlert = () => {
  //   return (
  //     <Alert severity={snackBarOptions.type}>{snackBarOptions.message}</Alert>
  //   );
  // };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* <Snackbar {...snackBarOptions}>{getSnackBarAlert()}</Snackbar>
        <SnackBarContext.Provider
          value={{ options: snackBarOptions, setOptions: setSnackBarOptions }}
        > */}
        {appConfig && (
          <AppContext.Provider value={appConfig}>
            <Box display={"flex"} className="App-header">
              <Main />
            </Box>
          </AppContext.Provider>
        )}
        {/* </SnackBarContext.Provider> */}
      </div>
      {/* Only show dev panel for local development */}
      {["pre_build", "local_build"].includes(getEnvironment()) && <DevPanel />}
    </ThemeProvider>
  );
}

export default App;
