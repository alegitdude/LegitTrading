import { Grid, Typography, Toolbar, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { nanoid } from "nanoid";

type iMetric = [string, number | string];
type Metrics = iMetric[];
type Props = {
  profile: Metrics;
};
const ProfileWidget = (props: Props) => {
  const { profile } = props;

  const sortedProfile = Object.entries(profile);

  const theme = useTheme();
  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Toolbar
            sx={{
              minHeight: "2rem",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              backgroundColor: theme.palette.secondary.dark,
            }}
          >
            <Typography variant="h4">Profile</Typography>
          </Toolbar>
        </Grid>

        <Grid
          container
          sx={{
            padding: "1rem",
            height: "300px",
            overflowY: "scroll",
            border: "1px solid black",
          }}
        >
          {sortedProfile[1] &&
            sortedProfile.map((item) => {
              const possibleKey = item[0].match(/([A-Z]?[^A-Z]*)/g);
              let key;
              if (possibleKey) {
                key = possibleKey.slice(0, -1).join(" ");
              } else key = "Key";

              return (
                <Grid
                  item
                  key={nanoid()}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: ".5rem",
                  }}
                  xs={12}
                  sm={6}
                  md={4}
                >
                  <li>
                    {key.charAt(0).toUpperCase() + key.slice(1)} : {item[1]}
                  </li>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Paper>
  );
};
export default ProfileWidget;
