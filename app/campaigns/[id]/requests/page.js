"use client";
import Navbar from "@/app/components/Navbar/navbar";
import getCampaign from "@/ethereum/campaign";
import web3 from "@/ethereum/web3";
import {
  Box,
  Button,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useEffect, useState } from "react";

const HeaderGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  alignItems: "center",
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

export default function Requests({ params }) {
  const [requests, setRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [approvers, setApprovers] = useState(0);
  const [campaign, setCampaign] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState({
    approve: null,
    finalize: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      const camp = getCampaign(params.id);
      setCampaign(camp);
      const count = await camp.methods.getRequestCount().call();
      const app = await camp.methods.approversCount().call();
      setApprovers(app);
      setRequestsCount(count);

      const requests = await Promise.all(
        Array(parseInt(count))
          .fill()
          .map((element, index) => {
            return camp.methods.requests(index).call();
          })
      );
      setRequests(requests);
      console.log(requests);
    };

    fetchRequests();
  }, [params.id]);

  const handleApprove = async (index) => {
    setLoadingIndex((prevState) => ({ ...prevState, approve: index }));
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(index).send({ from: accounts[0] });
      window.location.reload(); // Reload the page after successful transaction
    } catch (error) {
      console.error("Error approving request:", error);
      setError("An error occurred while approving the request.");
    } finally {
      setLoadingIndex((prevState) => ({ ...prevState, approve: null }));
    }
  };

  const handleFinalize = async (index) => {
    setLoadingIndex((prevState) => ({ ...prevState, finalize: index }));
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(index).send({ from: accounts[0] });
      window.location.reload();
    } catch (error) {
      console.error("Error finalizing request:", error);
      setError("An error occurred while finalizing the request.");
    } finally {
      setLoadingIndex((prevState) => ({ ...prevState, finalize: null }));
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <>
      <Navbar />
      <StyledBox>
        <HeaderGrid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" style={{ fontSize: "1.25rem" }}>
              Requests
            </Typography>
          </Grid>
          <Grid item>
            <Link href={`/campaigns/${params.id}/requests/new`} passHref>
              <Button variant="contained" color="primary">
                Add Request
              </Button>
            </Link>
          </Grid>
        </HeaderGrid>
        {approvers && requests.length ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Approval Count</TableCell>
                  <TableCell>Approve</TableCell>
                  <TableCell>Finalize</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.description}</TableCell>
                    <TableCell>
                      {web3.utils.fromWei(Number(request.value), "ether")}{" "}
                      Ethers
                    </TableCell>
                    <TableCell>{request.recipient}</TableCell>
                    <TableCell>
                      {Number(request.approvalCount)}/{Number(approvers)}
                    </TableCell>
                    {console.log(request.complete)}
                    {request.complete ? (
                      <TableCell>
                        <Button variant="contained" color="success">
                          Already Finalized
                        </Button>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <Button
                          onClick={() => handleApprove(index)}
                          disabled={loadingIndex.approve === index}
                        >
                          {loadingIndex.approve === index ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {request.complete ? (
                      <></>
                    ) : (
                      <TableCell>
                        <Button
                          onClick={() => handleFinalize(index)}
                          disabled={loadingIndex.finalize === index}
                        >
                          {loadingIndex.finalize === index ? (
                            <CircularProgress size={24} />
                          ) : (
                            "Finalize"
                          )}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No requests found.</Typography>
        )}
      </StyledBox>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </>
  );
}
