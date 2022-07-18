import { Add, Close } from "@mui/icons-material";
import { Alert, Box, Button, IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { addAlert, deleteAlert, getCourseAlerts } from "../utils/api-connector";
import { AppContext } from "../utils/common/context";
import { TemplateAlert } from "../utils/types";
import AddAlertDialog from "./AddAlertDialog";

interface AlertPanelProps {}

/** Show basic header info */
function AlertPanel(props: AlertPanelProps) {
  const appInfo = useContext(AppContext);
  const [alerts, setAlerts] = useState<TemplateAlert[]>([]);
  const [addAlertDialogOpen, setAddAlertDialogOpen] = useState(false);

  useEffect(() => {
    // Retrieve the list of alerts to display
    fetchAlerts();
    // The empty dependency array '[]' means this will run once, when the component renders
  }, []);

  // Dialog management
  const handleOpenAddAlertDialog = () => {
    setAddAlertDialogOpen(true);
  };

  const handleCloseAddAlertDialog = (event?: object, reason?: string) => {
    // This condition prevents the user from closing the dialog by
    // clicking in the backdrop or hitting the esc key
    // The condition can be removed, it is just here to show the option
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setAddAlertDialogOpen(false);
  };

  const handleSaveAddAlertDialog = async (newAlert: TemplateAlert) => {
    await addAlert(newAlert);
    // Close the dialog
    setAddAlertDialogOpen(false);
    // Refresh the alerts to display
    await fetchAlerts();
  };

  const handleDeleteAlert = async (alertId: string) => {
    await deleteAlert(alertId);
    // Refresh the alerts to display
    await fetchAlerts();
  };

  const fetchAlerts = async () => {
    const courseAlerts = await getCourseAlerts();
    setAlerts(courseAlerts);
  };

  return (
    <Box>
      {appInfo.isInstructor && (
        <Box pt={1} pb={1}>
          <Button
            startIcon={<Add />}
            variant="outlined"
            onClick={handleOpenAddAlertDialog}
          >
            Add Alert
          </Button>
        </Box>
      )}
      {alerts.map((alert, i) => (
        // Dynamically generated components need a unique key attribute
        <Box
          key={`alert-${i}`}
          p={0.25}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box width="100%">
            <Alert
              severity={alert.type}
              action={
                appInfo.isInstructor && (
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <Close />
                  </IconButton>
                )
              }
            >
              {alert.message}
            </Alert>
          </Box>
        </Box>
      ))}
      {/* DIALOGS */}
      <AddAlertDialog
        handleClose={handleCloseAddAlertDialog}
        handleSave={handleSaveAddAlertDialog}
        open={addAlertDialogOpen}
      />
    </Box>
  );
}

export default AlertPanel;
