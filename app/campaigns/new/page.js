"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "@/app/components/Navbar/navbar";
import factory from "../../../ethereum/factory";
import web3 from "@/ethereum/web3";
import { useRouter } from "next/navigation";

const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
  padding: theme.spacing(3),
}));

const CreateCampaign = () => {
  const [minContribution, setMinContribution] = useState("");
  const [description, setDescription] = useState("");
  const [errmsg, setErrmsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrmsg(null);
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();
      console.log("Minimum Contribution:", minContribution);
      console.log("Description:", description);
      await factory.methods
        .createCampaign(
          await web3.utils.toWei(minContribution, "ether"),
          description
        )
        .send({
          from: accounts[0],
        });
      router.push("/");
    } catch (error) {
      setErrmsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {errmsg && (
        <Alert variant="filled" severity="error">
          {errmsg}
        </Alert>
      )}
      <FormContainer>
        <Typography variant="h5" gutterBottom>
          Create a New Campaign
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Minimum Contribution in Ethers"
            variant="outlined"
            fullWidth
            margin="normal"
            value={minContribution}
            onChange={(e) => setMinContribution(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

export default CreateCampaign;
