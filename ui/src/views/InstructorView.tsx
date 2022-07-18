import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import AlertPanel from "../components/AlertPanel";
import CommentsTable from "../components/CommentsTable";
import { getCourseComments } from "../utils/api-connector";
import { TemplateComment } from "../utils/types";

function InstructorView() {
  const [comments, setComments] = useState<TemplateComment[]>([]);

  useEffect(() => {
    getCourseComments().then((comments) => {
      setComments(comments);
    });
  }, []);

  return (
    <>
      <AlertPanel />
      <Box pt={1}>
        <CommentsTable rows={comments} />
      </Box>
    </>
  );
}

export default InstructorView;
