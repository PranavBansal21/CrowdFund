import web3 from "./web3";
import Campaignfactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  Campaignfactory.abi,
  "0xfDe94Efc13A4b307402eAc99B2EDf65489373de1"
);

export default instance;
