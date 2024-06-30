"use client";
import { useEffect, useState } from "react";
import factory from "../ethereum/factory";
import campaignInstance from "../ethereum/campaign";
import {
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import Navbar from "./components/Navbar/navbar";
import Link from "next/link";

export default function Home() {
  const [campaigns, setCampaigns] = useState(null);

  useEffect(() => {
    const getCampaign = async () => {
      const campaignAddresses = await factory.methods
        .getDeployedCampaigns()
        .call();
      const campaignDetails = await Promise.all(
        campaignAddresses.map(async (address) => {
          const campaign = campaignInstance(address);
          const description = await campaign.methods.description().call();
          return { address, description };
        })
      );
      console.log(campaignDetails);
      setCampaigns(campaignDetails);
    };
    getCampaign();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 3 }}>
        {campaigns ? (
          <Grid container spacing={3}>
            {campaigns.map((campaign, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      Campaign Address
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {campaign.address}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      sx={{ mt: 2 }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {campaign.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={`/campaigns/${campaign.address}`} passHref>
                      <Button variant="contained" color="primary" fullWidth>
                        View Campaign
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "70vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </>
  );
}
