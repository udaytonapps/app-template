import { createTheme, useMediaQuery, useTheme } from "@mui/material";

interface AppThemeOptions {
  baseColor?: string;
  darkMode?: boolean;
}

/** Here is where we can customize the theme.
 *
 * See: https://mui.com/material-ui/customization/theming/
 */
export const useAppTheme = (options: AppThemeOptions) => {
  /** An indication that the user has set (on a compatible browser) that they prefer dark mode */
  /* eslint-disable-next-line */
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  /** The default primary color (used if no other primary color is specified) */
  const defaultPrimary = useTheme().palette.primary.main;
  /** The darkMode indicator passed along from the backend */
  const darkMode = !!options?.darkMode;
  // baseColor is often too low of contrast for dark mode elements, using white as default
  const main = (darkMode && "#fff") || options?.baseColor || defaultPrimary;
  const theme = createTheme({
    palette: {
      primary: {
        main,
      },
      mode: darkMode ? "dark" : "light",
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: "bold",
          },
        },
      },
    },
  });
  return theme;
};
