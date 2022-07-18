import {
  AlertColor,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TemplateAlert } from "../utils/types";

interface AddAlertDialogProps {
  handleClose: (event?: object, reason?: string) => void;
  handleSave: (newSettings: TemplateAlert) => void;
  open: boolean;
}

/** Show settings form */
function AddAlertDialog(props: AddAlertDialogProps) {
  const { handleClose, handleSave, open } = props;

  // Form management
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<any>({
    defaultValues: {
      type: null,
      message: "",
    },
  });

  // Reset form values whenever the dialog is opened
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  /** Handles submission of the form data */
  const onSubmit = (data: TemplateAlert) => {
    // Can format the data as needed before saving...
    handleSave(data);
  };

  const options: AlertColor[] = ["success", "info", "warning", "error"];

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box p={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Alert</DialogTitle>
          <DialogContent>
            <Box mb={3}>
              <DialogContentText>
                Add an alert by specifying the message and type (optional).
              </DialogContentText>
            </Box>
            {/* ALERT TYPE */}
            <Box display={"flex"} flexDirection={"column"} mt={1} mb={2}>
              <FormControl>
                <FormLabel>
                  Alert Type
                  <Controller
                    control={control}
                    name="type"
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup onChange={onChange} value={value}>
                        {options.map((option, i) => (
                          <FormControlLabel
                            key={`radio-${option}-${i}`}
                            control={<Radio />}
                            label={
                              option[0].toUpperCase() + option.substring(1)
                            }
                            value={option}
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                </FormLabel>
              </FormControl>
            </Box>
            {/* ALERT MESSAGE */}
            <Box display={"flex"} flexDirection={"column"} mt={1} mb={2}>
              <FormLabel>
                Alert Message
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  error={!!errors.message}
                  helperText={!!errors.message && "This field is required."}
                  {...register("message", { required: true })}
                />
              </FormLabel>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
}

export default AddAlertDialog;
