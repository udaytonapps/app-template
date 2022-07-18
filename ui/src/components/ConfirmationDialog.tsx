import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmationDialogProps {
  handleClose: () => void;
  handleConfirm: () => void;
  open: boolean;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { handleClose, handleConfirm, open } = props;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            Are you sure you want to submit this token request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleConfirm} autoFocus variant={"contained"}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
