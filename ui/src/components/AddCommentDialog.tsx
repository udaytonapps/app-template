import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TemplateComment } from "../utils/types";

interface AddCommentDialogProps {
  handleClose: (event?: object, reason?: string) => void;
  handleSave: (newSettings: TemplateComment) => void;
  open: boolean;
}

/** Show settings form */
function AddCommentDialog(props: AddCommentDialogProps) {
  const { handleClose, handleSave, open } = props;

  // Form management
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<any>({
    defaultValues: {
      text: "",
    },
  });

  // Reset form values whenever the dialog is opened
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  /** Handles submission of the form data */
  const onSubmit = (data: TemplateComment) => {
    console.log(data);
    // Can format the data as needed before saving...
    handleSave(data);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box p={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <Box mb={3}>
              <DialogContentText>
                Add a comment by specifying the message.
              </DialogContentText>
            </Box>
            {/* COMMENT MESSAGE */}
            <Box display={"flex"} flexDirection={"column"} mt={1} mb={2}>
              <FormLabel>
                Comment Message
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  error={!!errors.text}
                  helperText={!!errors.text && "This field is required."}
                  {...register("text", { required: true })}
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

export default AddCommentDialog;
