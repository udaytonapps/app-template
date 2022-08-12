import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import AddCommentDialog from "../components/AddCommentDialog";
import AlertPanel from "../components/AlertPanel";
import CommentsTable from "../components/CommentsTable";
import { addComment, getCourseComments } from "../utils/api-connector";
import { TemplateComment } from "../utils/types";

function LearnerView() {
  const [comments, setComments] = useState<TemplateComment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve the list of alerts to display
    fetchComments();
    // The empty dependency array '[]' means this will run once, when the component renders
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const comments = await getCourseComments();
    setComments(comments);
    setLoading(false);
  };

  const handleClickAddComment = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = (event?: object, reason?: string) => {
    // This condition prevents the user from closing the dialog by
    // clicking in the backdrop or hitting the esc key
    // The condition can be removed, it is just here to show the option
    const reasonsToStayOpen = ["backdropClick", "escapeKeyDown"];
    if (reason && reasonsToStayOpen.includes(reason)) {
      return;
    }
    setDialogOpen(false);
  };

  const handleSaveDialog = async (newComment: TemplateComment) => {
    await addComment(newComment);
    // Close the dialog
    setDialogOpen(false);
    // Refresh the alerts to display
    await fetchComments();
  };

  // const handleDeleteComment = async (commentId: string) => {
  //   // await deleteComment(commentId);
  //   // Refresh the alerts to display
  //   await fetchComments();
  // };

  return (
    <>
      <Box pb={1}>
        <AlertPanel />
      </Box>
      <Box display={"flex"} justifyContent={"end"}>
        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={handleClickAddComment}
        >
          Add Comment
        </Button>
      </Box>
      <Box pt={1}>
        <CommentsTable loading={loading} rows={comments} />
      </Box>
      {/* DIALOGS */}
      <AddCommentDialog
        handleClose={handleCloseDialog}
        handleSave={handleSaveDialog}
        open={dialogOpen}
      />
    </>
  );
}

export default LearnerView;
