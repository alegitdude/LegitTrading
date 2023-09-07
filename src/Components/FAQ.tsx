import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Container, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const url = "https://finnhub.io/";
const faqDetails = [
  {
    question: "How does your service work?",
    answer:
      "You provide your Finnhub api key and we make http requests to their api and display all the data you desire. You customize what and how the data is displayed to create your own dashboard ",
  },
  {
    question: "How is this service free?",
    answer:
      "You provide your own Finnhub api key so our service can remain free! There is no money transacted through our site nor when you sign up for Finnhub",
  },
  {
    question: "How do you protect our api key?",
    answer:
      "Only someone with your credentials can access your api key. All data is encrypted at REST with AES-256 and in transit via TLS. ",
  },
  {
    question: "How do I get a Finnhub api key?",
    answer: (
      <span>
        Follow this link: &nbsp;
        <a style={{ color: "#fff" }} href={url}>
          Finnhub
        </a>
        , and you can get a free api key in a matter of seconds.
      </span>
    ),
  },
  {
    question: "Why use Finnhub for market data?",
    answer:
      "Finnhub provides the most generous free tier for data access and has the widest array of different markets and utilities available for free ",
  },
  {
    question: "What info is stored in our account?",
    answer:
      "We securely store your api key for future use, and we store all the dashboard settings you save, so when you log back in your widgets and charts can preload all your saved settings",
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <Container
      id="FAQ"
      sx={{
        textAlign: "center",
        mb: "9rem",
        maxWidth: "900px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography mb="4rem" variant="h2">
        FAQ
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          background: `linear-gradient(to top, ${theme.palette.background.default},  ${theme.palette.secondary.dark}, ${theme.palette.background.default})`,
          padding: "1rem",
          marginLeft: "3rem",
          marginRight: "3rem",
          width: "100%",
        }}
      >
        {faqDetails.map((detail, i) => {
          return (
            <Grid
              key={i}
              item
              md={6}
              sx={{
                width: "100%",
                padding: "0 1rem 0 1rem",
              }}
            >
              <Accordion
                expanded={expanded === `${i}`}
                onChange={handleChange(`${i}`)}
                sx={{
                  backgroundColor: `${theme.palette.background.default}`,
                  border: `1px solid ${theme.palette.primary.main}`,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography>{detail.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{detail.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
