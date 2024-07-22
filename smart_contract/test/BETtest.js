const { expect } = require("chai");
const {ethers} = require("hardhat");


describe("test",  function () {
    
  it("BET test units", async function () {
    // USDC DEPLOYMENT
    const [user1,user2] = await ethers.getSigners();
    const usdc = await ethers.deployContract("USDC");
    await usdc.waitForDeployment();
    const usdcAddress=await usdc.getAddress();

    //AMM DEPLOYMENT
    const AMM = await ethers.deployContract("AMM", [usdcAddress]);
    await AMM.waitForDeployment();
    const AMM_Address = await AMM.getAddress();
    
    //BET DEPLOYMENT
    function convertDateToTimestamp(dateString) {
        const date = new Date(dateString);
        const timestamp = Math.floor(date.getTime() / 1000); // Convert to seconds
        return timestamp;
    }
    // Convert the human-readable date to a Unix timestamp
    const humanReadableDate = "23 July 2024 23:00:00"; // Example date
    const timestamp1= convertDateToTimestamp(humanReadableDate);
    console.log("Converted timestamp:", timestamp1);

    const etherAmount = ethers.parseUnits("10");
    const BET = await ethers.deployContract("Bet", [AMM_Address,usdcAddress,2,timestamp1 ], {value:etherAmount});
    await AMM.waitForDeployment();
    const BET_Address = await BET.getAddress();
    
    console.log("owner", await BET.owner());
    console.log("player", await BET.player() );
    console.log("rate", await BET.rate());
    console.log("deadline", await BET.deadline());
    console.log("oracle", await BET.oracle());
    console.log("tok", await BET.tok());

   //GET TIMESTAMP
   const timestamp = await BET.getCurrentTimestamp(); 
   const timestampNumber = Number(timestamp);
   const date = new Date(timestampNumber * 1000); 
   console.log("TimeStamp", date.toString());

   //check bet balance 

   console.log("BALANCE_ETHER_AMM = ",   ((await AMM.getEtherBalance(BET_Address)).toString())/10**18);

  // BET FUNCTION
  const potBet = ethers.parseUnits("10");
  await BET.connect(user2).bet({value:potBet});
  console.log("initialpot", await BET.initialpot());
  console.log("BALANCE_ETHER_AMM = ",   ((await AMM.getEtherBalance(BET_Address)).toString())/10**18);
  console.log("player", await BET.player());


//WIN FUNCTION
await BET.connect(user2).win();

//GET TOKEN
console.log(await BET.callGetTokens());
  });})