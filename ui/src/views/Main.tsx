import { Box } from "@mui/material";
import { useContext } from "react";
import Header from "../components/Header";
import { AppContext } from "../utils/common/context";
import InstructorView from "./InstructorView";
import LearnerView from "./LearnerView";

function Main() {
  const appConfig = useContext(AppContext);

  return (
    <Box
      width={"100%"}
      p={4}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
    >
      {/* A header shared between any views */}
      <Header />
      <Box pt={2}>
        {/* Condition for views */}
        {appConfig.isInstructor ? (
          // Show Instructor View if isInstructor === true
          <InstructorView />
        ) : (
          // Otherwise, show Learner View
          <LearnerView />
        )}
      </Box>
    </Box>
  );
}

export default Main;
