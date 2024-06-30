"use client";
import Navbar from "@/app/components/Navbar/navbar";
import getCampaign from "@/ethereum/campaign";
import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Contribute from "@/app/components/Contribute/contribute";
import web3 from "@/ethereum/web3";
import Link from "next/link";

const DetailItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const DetailsGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export default function Campaign({ params }) {
  const [details, setDetails] = useState(null);
  const [campaign, setCampaign] = useState(null);

  async function getCampaignDetails() {
    const camp = getCampaign(params.id);
    setCampaign(camp);
    const res = await camp.methods.getDetails().call();
    const description = await camp.methods.description().call();
    console.log(res[0]);
    setDetails({
      description: description,
      minimumContribution: web3.utils.fromWei(Number(res[0]), "ether"),
      balance: web3.utils.fromWei(Number(res[1]), "ether"),
      noOfRequests: Number(res[2]),
      approversCount: Number(res[3]),
      manager: res[4],
    });
  }

  const handleContribute = async (amount) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: amount,
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getCampaignDetails();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {details ? (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Campaign Description
              </Typography>
              <Typography variant="body1" align="center" color="textSecondary">
                {details.description}
              </Typography>
            </Box>
            <DetailsGrid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <DetailItem>
                  <Typography variant="h6">Minimum Contribution</Typography>
                  <Typography variant="body1">
                    {details.minimumContribution} Ethers
                  </Typography>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailItem>
                  <Typography variant="h6">Balance</Typography>
                  <Typography variant="body1">
                    {details.balance} Ethers
                  </Typography>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailItem>
                  <Typography variant="h6">Number of Requests</Typography>
                  <Typography variant="body1">
                    {details.noOfRequests}
                  </Typography>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailItem>
                  <Typography variant="h6">Number of Approvers</Typography>
                  <Typography variant="body1">
                    {details.approversCount}
                  </Typography>
                </DetailItem>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <DetailItem>
                  <Typography variant="h6">Address of Manager</Typography>
                  <Typography variant="body1">{details.manager}</Typography>
                </DetailItem>
              </Grid>
            </DetailsGrid>
            <Contribute onSubmit={handleContribute} />
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Link href={`/campaigns/${params.id}/requests`} passHref>
                <Button variant="contained" color="primary">
                  View Requests
                </Button>
              </Link>
            </Box>
          </>
        ) : (
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        )}
      </Box>
    </>
  );
}
