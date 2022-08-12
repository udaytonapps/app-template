import { Close, InfoOutlined } from "@mui/icons-material";
import { Box, Card, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getInfo } from "../../utils/api-connector";
import { getEnvironment } from "../../utils/common/helpers";
import { LtiAppInfo } from "../../utils/common/types";

interface DevPanelProps {
  serverError?: string;
}

/**
 * Show development information during pre-build.
 * Dev panel does not rely on appInfo context.
 * This is because the dev panel should show whether
 * or not the appInfo was successfully retrieved.
 */
function DevPanel(props: DevPanelProps) {
  const [serverError, setServerError] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [appInfo, setAppInfo] = useState<LtiAppInfo>();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    getInfo().then((info) => {
      console.log(info);
      if (info) {
        if (typeof info === "string") {
          console.error("Server error");
          setServerError(info);
          if ((info as string).includes("Session expired")) {
            console.error("SESSION EXPIRED");
            setExpired(true);
          }
        } else {
          setAppInfo(info);
          setExpired(false);
        }
      }
    });
  }, []);

  return (
    <Box position={"absolute"} top={0} p={2}>
      {hidden ? (
        <>
          <IconButton onClick={() => setHidden(!hidden)}>
            <InfoOutlined />
          </IconButton>
        </>
      ) : (
        <>
          {serverError && (
            <Box>
              <Box dangerouslySetInnerHTML={{ __html: serverError }}></Box>
            </Box>
          )}
          <Card sx={{ border: "2px solid red" }}>
            <Box p={2} textAlign="left">
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"start"}
              >
                <Box>
                  <Typography>
                    React App status is: {getEnvironment()}
                  </Typography>
                  <Typography>
                    Name: {appInfo?.username}, Role:{" "}
                    {appInfo?.isInstructor ? "Instructor" : "Learner"}
                  </Typography>
                  <Typography>Session ID is: {appInfo?.sessionId}</Typography>
                  Session is: {expired ? "INVALID" : "VALID"}
                </Box>
                <IconButton onClick={() => setHidden(!hidden)}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
          </Card>
        </>
      )}
    </Box>
  );
}

export default DevPanel;
