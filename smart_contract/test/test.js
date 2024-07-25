const { expect } = require("chai");
const {ethers} = require("hardhat");


describe("AMM contract", function () {
  it("Deployment should assign A token to the contract", async function () {
    const [owner] = await ethers.getSigners();
  //***********USDC DEPLOYMENT***********************//
    const hardhatUSDC = await ethers.deployContract("USDC");
    await hardhatUSDC.waitForDeployment();
    const USDC_Address = await hardhatUSDC.getAddress();
    const usdcOwner = await hardhatUSDC.owner();
    console.log("USDC address ", USDC_Address);
    console.log("USDC owner ", usdcOwner);
    console.log("USDC owner default ", usdcOwner);
    
  //************** AMM DEPLOYMENT  *****************//
    const hardhatAMM = await ethers.deployContract("AMM", [USDC_Address]);
    await hardhatAMM.waitForDeployment();
    const AMM_Address = await hardhatAMM.getAddress();
    const tokenAmm_Address = await hardhatAMM.get_TokenAddress();
    console.log("AMM address ", AMM_Address);
    console.log("tokenAMM address ", tokenAmm_Address);


  //******************* CHECK BALANCES BFORE TRANSACTIONS******************* *//
    console.log("BALANCE_ETHER_AMM = ",   await hardhatAMM.getEtherBalance(AMM_Address));
    console.log("BALANCE_ERC20_AMM= ",    await hardhatAMM.getBalanceOfERC20(AMM_Address) );
    //const balance = await ethers.provider.getBalance(ammContractAddress);
  
  //***************** APPROVE****************************//
    await hardhatUSDC.connect(owner).approve(hardhatAMM,100);
    const allawanceValue =await hardhatUSDC.allowance(owner.getAddress(),AMM_Address);
    console.log("allawance Value ",allawanceValue);

  //***********ADD LIQUIDITY *****************************//
    const etherAmount = ethers.parseUnits("0.000000000000000020");
    const tx=await hardhatAMM.connect(owner).addLiquidity(100, {value: etherAmount} );
    console.log("Transaction ", tx);
    // { value: ethers.parseEther("0.0000000000005") }

  //******************* CHECK BALANCES AFTER TRANSACTIONS******************* *//
    console.log("BALANCE_ETHER_AMM = ",   await hardhatAMM.getEtherBalance(AMM_Address));
    console.log("BALANCE_ERC20_AMM= ",    await hardhatAMM.getBalanceOfERC20(AMM_Address) );

//******************* get Tokens ******************* *//
    console.log("Tokens of AMM are : ",   await hardhatAMM.getTokens());

//******************* getRate ***********************//
    const rateusdc1= parseFloat((await hardhatAMM.getRate("usdc")).toString())* 0.000000000000000001;
    const rateusdc2= parseFloat((await hardhatAMM.getRate("usdc")));
    console.log("usdc Rate2 : ", rateusdc2);
    const rateether1= parseFloat((await hardhatAMM.getRate("ether")).toString())* 0.000000000000000001;
    const rateether2= parseFloat((await hardhatAMM.getRate("ether")));
    console.log("ether Rate : ", rateether2);
    

  });
});

 //* regulate values***   

/*

const etherAmount2 = ethers.parseUnits("0.000000000000000002");
await hardhatAMM.swap({value:etherAmount2}); // 100ms

console.log("k",await hardhatAMM.k());
console.log("initialbalancEether", await hardhatAMM.initialbalancEether());
console.log("initialbalanceToken", await hardhatAMM.initialbalanceToken());
console.log("_ExpBalanceEther",await hardhatAMM._ExpBalanceEther());
console.log("_ExpBalanceToken",parseFloat((await hardhatAMM._ExpBalanceToken()).toString())* 0.000000000000000001);

console.log("_valueToTransfer",parseFloat((await hardhatAMM._valueToTransfer()).toString())* 0.000000000000000001);
console.log("_expect",parseFloat((await hardhatAMM._expect()).toString())* 0.000000000000000001);


 });
 });*/
