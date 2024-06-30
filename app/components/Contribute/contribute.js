// components/Contribute/contribute.js
"use client";
import { useState } from "react";
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

const Contribute = ({ onSubmit }) => {
  const [contribution, setContribution] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(web3.utils.toWei( contribution, "ether"));
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <FormContainer>
      <Typography variant="h5" gutterBottom>
        Contribute to this Campaign
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <StyledTextField
          label="Contribution (Ethers)"
          variant="outlined"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={24} />}
        >
          {loading ? "Processing..." : "Contribute"}
        </Button>
      </form>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default Contribute;
