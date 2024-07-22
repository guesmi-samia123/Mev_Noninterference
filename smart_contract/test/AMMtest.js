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
    const smallunit =await usdc.balanceOf(usdcOwner);
    //THE VALUE ON USDC
    const usdcValue =(smallunit.toString())/10**18;
    //CHECK USDC ATTRIBUTES
    console.log("USDC address ", usdcAddress);
    console.log("USDC owner address ", usdcOwner);
    console.log("USDC owner balance ", ((await usdc.balanceOf(usdcOwner)).toString())/ 10**18, "ether");
    console.log("USDC decimal ",   await usdc.decimals());
    console.log("USDC total supply ",   await usdc.totalSupply(), "small unit");
    console.log("USDC balance owner on small unit", smallunit , "small unit");
    console.log("USDC owner on usdc ",usdcValue , "usdc");

    //AMM DEPLOYMENT
    const AMM = await ethers.deployContract("AMM", [usdcAddress]);
    await AMM.waitForDeployment();
    const AMM_Address = await AMM.getAddress();
    const tokenAmm_Address = await AMM.get_TokenAddress();
    console.log("AMM address ", AMM_Address);
    console.log("tokenAMM address ", tokenAmm_Address);

    //CHECK THE BALANCE BEFORE LIQUIDITY 
    console.log("BALANCE_ETHER_AMM = ",   await AMM.getEtherBalance(AMM_Address));
    console.log("BALANCE_ERC20_AMM= ",    await AMM.getBalanceOfERC20(AMM_Address) );

    //APPROVE
     await usdc.connect(user1).approve(AMM,600* 10**6);
     const allawanceValue =await usdc.allowance(user1.getAddress(),AMM_Address);
     console.log("allawance Value ",allawanceValue);
 
   //***********ADD LIQUIDITY *****************************
     const etherAmount = ethers.parseUnits("600");
     const usdcAmount=ethers.parseUnits("600", 6)
     const tx=await AMM.connect(user1).addLiquidity(usdcAmount, {value: etherAmount} );
     console.log("Transaction ", tx);
    
    //CHECK THE BALANCE AFTER LIQUIDITY 
    console.log("BALANCE_ETHER_AMM = ",   ((await AMM.getEtherBalance(AMM_Address)).toString())/10**18);
    console.log("BALANCE_ERC20_AMM= ",    ((await AMM.getBalanceOfERC20(AMM_Address)).toString())/10**6 );


  //******************* get Tokens ******************* *//
  console.log("Tokens of AMM are : ",   await AMM.getTokens());

/******************* getRate ***********************/
console.log("rate ether", parseFloat((await AMM.getRate("ether")).toString())* 0.000000000000000001);
console.log("rate usdc", parseFloat((await AMM.getRate("usdc")).toString())* 0.000001);


//SWAP
console.log("msg.sender balance before the swap token= ",   ( (await AMM.getBalanceOfERC20(user1.getAddress())).toString())/10**6 );
console.log("msg.sender balance before the swap ether= ",   ((await AMM.getEtherBalance(user1.getAddress())).toString())/10**18);

const etherAmount2 = ethers.parseUnits("300");
await AMM.swap(0,{value:etherAmount2} ); // 100ms

console.log("k",await AMM.k());
console.log("initialbalancEether", await AMM.initialbalancEether());
console.log("initialbalanceToken", await AMM.initialbalanceToken());
console.log("_ExpBalanceEther",await AMM._ExpBalanceEther());
console.log("_ExpBalanceToken", await AMM._ExpBalanceToken());
console.log("_valueToTransfer",await AMM._valueToTransfer());
console.log("amountusdcsend",await AMM.amountusdcsend());
//check balance after swap
console.log("BALANCE_ETHER_AMM = ",   ((await AMM.getEtherBalance(AMM_Address)).toString())/10**18);
console.log("BALANCE_ERC20_AMM= ",   ( (await AMM.getBalanceOfERC20(AMM_Address)).toString())/10**6 );
console.log("msg.sender balance ether  afeter the swap=  ",   ((await AMM.getEtherBalance(user1.getAddress())).toString())/10**18);
console.log("msg.sender balance usdc afeter the swap= ",   ( (await AMM.getBalanceOfERC20(user1.getAddress())).toString())/10**6 );

}); 
});
