import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import AlertPanel from "../components/AlertPanel";
import CommentsTable from "../components/CommentsTable";
import { getCourseComments } from "../utils/api-connector";
import { TemplateComment } from "../utils/types";

function InstructorView() {
  const [comments, setComments] = useState<TemplateComment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Turn loading indicator on
    getCourseComments().then((comments) => {
      setComments(comments);
      setLoading(false); // Turn loading indicator off
    });
  }, []);

  return (
    <>
      <AlertPanel />
      <Box pt={1}>
        <CommentsTable loading={loading} rows={comments} />
      </Box>
    </>
  );
}

export default InstructorView;
