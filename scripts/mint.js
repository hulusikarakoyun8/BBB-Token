const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("🔑 Cüzdan:", deployer.address);
  
  // Kontrat adresini girin
  const contractAddress = "KONTRAT_ADRESINIZI_GIRIN";
  
  const BBBToken = await hre.ethers.getContractFactory("BBBToken");
  const token = BBBToken.attach(contractAddress);
  
  console.log("💰 Token bakiyeniz:", 
    hre.ethers.utils.formatEther(await token.balanceOf(deployer.address)), "BBB");
  
  const oyuncuAdresi = "OYUNCU_ADRESI_GIRIN";
  const miktar = hre.ethers.utils.parseEther("100");
  
  console.log(`\n🎮 Oyuncuya token basılıyor: ${oyuncuAdresi}`);
  console.log(`Miktar: 100 BBB`);
  
  const tx = await token.mint(oyuncuAdresi, miktar);
  await tx.wait();
  
  console.log("✅ Token basma işlemi tamamlandı!");
  console.log("İşlem hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
