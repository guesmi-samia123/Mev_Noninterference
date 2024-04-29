const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("AMM contract", function () {
  it("Deployment should assign A token to the contract", async function () {
    // ******** DEPLOY USDC CONTRACT ************//
    const [owner] = await ethers.getSigners();
    const hardhatUSDC = await ethers.deployContract("USDC");
    await hardhatUSDC.waitForDeployment();

    const hardhatUSDCAddress = await hardhatUSDC.getAddress();
    console.log("deployed address ", hardhatUSDCAddress);
    const ownerBalance = await hardhatUSDC.balanceOf(owner.address);
    const ownerAddress = await owner.getAddress();
    

    //**************DEPLOY AMM CONTRACT  ***************/
    const hardhatAMM = await ethers.deployContract("AMM", [hardhatUSDCAddress]);
    await hardhatAMM.waitForDeployment();

    const hardhatAMMAddress = await hardhatAMM.getAddress();
    const tokenAddress = await hardhatAMM.get_TokenAddress();
    const ownerAddress2 = await owner.getAddress();
    console.log("deployed address " +hardhatAMMAddress+ " token used " +tokenAddress );
    console.log("owner address" +ownerAddress2);

    const BALANCE_ETHER_OWNER = await hardhatAMM.getEtherBalance(ownerAddress2);
    const BALANCE_ETHER_AMM = await hardhatAMM.getEtherBalance(hardhatAMMAddress);
    console.log("BALANCE_ETHER_OWNER = ", BALANCE_ETHER_OWNER);
    console.log("BALANCE_ETHER_AMM = ", BALANCE_ETHER_AMM );

   const BALANCE_ERC20_owner = await hardhatAMM.getBalanceOfERC20(ownerAddress2);
   const BALANCE_ERC20_AMM = await hardhatAMM.getBalanceOfERC20(hardhatAMMAddress);

  console.log("BALANCE_ERC20_OWNER = ", BALANCE_ERC20_owner );
  console.log(" BALANCE_ERC20_AMM= ",  BALANCE_ERC20_AMM );

  //***********ADD LIQUIDITY ****************//

  const etherAmount = ethers.parseEther("1", "gwei");
  const usdcAmount = 100;
  await hardhatAMM.addLiquidity(usdcAmount, { value: etherAmount });

/*const transactionHash = await owner.sendTransaction({
  to: "contract address",
  value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
});*/
  });
});