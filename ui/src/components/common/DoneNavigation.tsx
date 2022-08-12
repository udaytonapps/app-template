import { Box, Link } from "@mui/material";

interface DoneNavigationprops {
  returnUrl: string;
  returnLabel?: string;
}

/** Holds navigation for linking to the LTI return url */
function DoneNavigation(props: DoneNavigationprops) {
  const { returnLabel, returnUrl } = props;
  return (
    <Box pt={3} pl={3}>
      <Link underline="hover" href={returnUrl} variant={"h6"}>
        {returnLabel || "Done"}
      </Link>
    </Box>
  );
}

export default DoneNavigation;
