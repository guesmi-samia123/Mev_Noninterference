const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("USDC", (m) => {
  const usdc = m.contract("USDC", []);
  return { usdc };
});