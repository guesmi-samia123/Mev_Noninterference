const { expect } = require("chai");
const {ethers} = require("hardhat");


describe("test",  function () {
    
  it("test units", async function () {
    const [user1, user2] = await ethers.getSigners();
    // returns the value on Wei
    const balanceWei = (await ethers.provider.getBalance(user1.getAddress())).toString(); 
    // the value on ether
    const balanceether =balanceWei / 10**18; 
    // Convert ether to Wei usiong parseUints function : parseUnits("ether on string") -> Wei
    const unit = ethers.parseUnits(balanceether.toString());
    
   console.log("Balance user1 in Ether:", balanceether, 'ether');
   console.log("Balance user1 in Wei:",balanceWei ,"Wei" );
   console.log("Balance user1 in Wei from parseuints Function:",unit , "Wei" );
  
  // DEPLOY USDC CONTRACT
    const usdc = await ethers.deployContract("USDC");
    await usdc.waitForDeployment();
    const usdcAddress=await usdc.getAddress();
    const usdcOwner=await usdc.owner();

    // THE VALUE ON MICRO-USDC
    const micro_usdc =await usdc.balanceOf(usdcOwner);
    //THE VALUE ON USDC
    const usdcValue =(micro_usdc.toString())/10**6;
    //CHECK USDC ATTRIBUTES
    console.log("USDC address ", usdcAddress);
    console.log("USDC owner address ", usdcOwner);
    console.log("USDC decimal ",   await usdc.decimals());
    console.log("USDC total supply on micro_usdc",   await usdc.totalSupply(), "micro_usdc");
    console.log("USDC total supply on usdc",   ((await usdc.totalSupply()).toString())/10**6, "usdc");
    console.log("USDC owner balance  on micro_usdc", micro_usdc , "micro_usdc");
    console.log("USDC owner balance on usdc ",usdcValue , "usdc");
    console.log("-------------------------------------- AMM  DEPLOYMENT -------------------------------------------------");
    
    //AMM DEPLOYMENT
    const AMM = await ethers.deployContract("AMM", [usdcAddress]);
    await AMM.waitForDeployment();
    const AMM_Address = await AMM.getAddress();
    const tokenAmm_Address = await AMM.get_TokenAddress();
    console.log("AMM address ", AMM_Address);
    console.log("tokenAMM address ", tokenAmm_Address);
    console.log("-------------------------------------- ADD LIQUIDITY -----------------------------------------------------");
    //CHECK THE BALANCE BEFORE LIQUIDITY 
    console.log("BALANCE_ETHER_AMM = ",   await AMM.getEtherBalance(AMM_Address));
    console.log("BALANCE_ERC20_AMM= ",    await AMM.getBalanceOfERC20(AMM_Address) );
  
    //APPROVE
     await usdc.connect(user1).approve(AMM,600* 10**6);
     const allawanceValue =((await usdc.allowance(user1.getAddress(),AMM_Address)).toString())/10**6;
     console.log("allawance Value ",allawanceValue);

   //***********ADD LIQUIDITY *****************************
     const etherAmount = ethers.parseUnits("600");
     const usdcAmount=ethers.parseUnits("600", 6)
     const tx=await AMM.connect(user1).addLiquidity(usdcAmount, {value: etherAmount} );
   
    
    //CHECK THE BALANCE AFTER LIQUIDITY 
    console.log("BALANCE_ETHER_AMM = ",   ((await AMM.getEtherBalance(AMM_Address)).toString())/10**18);
    console.log("BALANCE_ERC20_AMM= ",    ((await AMM.getBalanceOfERC20(AMM_Address)).toString())/10**6 );

  console.log("-------------------------------------- GET TOKENS ----------------------------------------------------------");
  console.log("Tokens of AMM are : ",   await AMM.getTokens());

  console.log("-------------------------------------- GET RATES -----------------------------------------------------------");  
  console.log("rate ether", parseFloat((await AMM.getRate("ether")).toString())* 0.000000000000000001);
  console.log("rate usdc", parseFloat((await AMM.getRate("usdc")).toString())* 0.000001);
 

console.log("-------------------------------------- GET RATES -------------------------------------------------");  
console.log("msg.sender balance before the swap token= ",   ( (await AMM.getBalanceOfERC20(user1.getAddress())).toString())/10**6 );
console.log("msg.sender balance before the swap ether= ",   ((await AMM.getEtherBalance(user1.getAddress())).toString())/10**18);

const etherAmount2 = ethers.parseUnits("300");
const amountusdc=ethers.parseUnits("300",6);
await usdc.connect(user1).approve(AMM, amountusdc);
await AMM.swap(300); // 100ms
console.log(await AMM.amount());
//console.log("Transaction ", tx);


console.log("k",await AMM.k());
console.log("initialbalancEether", await AMM.initialbalancEether());
console.log("initialbalanceToken", await AMM.initialbalanceToken());
console.log("_ExpBalanceEther",await AMM._ExpBalanceEther());
console.log("_ExpBalanceToken", await AMM._ExpBalanceToken());
console.log("_valueToTransfer",await AMM._valueToTransfer());
//check balance after swap
console.log("BALANCE_ETHER_AMM = ",   ((await AMM.getEtherBalance(AMM_Address)).toString())/10**18);
console.log("BALANCE_ERC20_AMM= ",   ( (await AMM.getBalanceOfERC20(AMM_Address)).toString())/10**6 );
console.log("msg.sender balance ether  afeter the swap=  ",   ((await AMM.getEtherBalance(user1.getAddress())).toString())/10**18);
console.log("msg.sender balance usdc afeter the swap= ",   ( (await AMM.getBalanceOfERC20(user1.getAddress())).toString())/10**6 );
}); 
});
