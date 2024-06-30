"use client";
import Navbar from "@/app/components/Navbar/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import getCampaign from "@/ethereum/campaign";
import web3 from "@/ethereum/web3";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  maxWidth: "500px",
  margin: "auto",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: "100%",
}));

export default function NewRequest({ params }) {
  const [campaign, setCampaign] = useState(null);
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    description: "",
    amount: "",
    recipient: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const campaign = getCampaign(params.id);
    setCampaign(campaign);
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          formValues.description,
          web3.utils.toWei(formValues.amount, "ether"),
          formValues.recipient
        )
        .send({ from: accounts[0] });
      setLoading(false);
      router.push(`/campaigns/${params.id}/requests`);
    } catch (error) {
      setLoading(false);
      setError(error.message || "An error occurred. Please try again.");
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {/* <Link href={`/campaigns/${params.id}/requests`} passHref>
          <Typography variant="body1" component="a" gutterBottom>
            Back
          </Typography>
        </Link> */}
        <FormContainer>
          <Typography variant="h5" gutterBottom>
            Create a Request
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <StyledTextField
              label="Description"
              variant="outlined"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />
            <StyledTextField
              label="Amount in Ethers"
              variant="outlined"
              name="amount"
              value={formValues.amount}
              onChange={handleInputChange}
              required
            />
            <StyledTextField
              label="Recipient Address"
              variant="outlined"
              name="recipient"
              value={formValues.recipient}
              onChange={handleInputChange}
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} /> : null}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </form>
        </FormContainer>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
