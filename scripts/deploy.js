const hre = require("hardhat");

async function main() {
  console.log("🚀 BBB Token deploy başlıyor...");
  
  const BBBToken = await hre.ethers.getContractFactory("BBBToken");
  const token = await BBBToken.deploy();
  
  await token.deployed();
  
  console.log(`✅ BBB Token başarıyla deploy edildi!`);
  console.log(`📄 Kontrat adresi: ${token.address}`);
  console.log(`🔗 Ağ: ${hre.network.name}`);
  
  console.log("\n📝 Kontrat Bilgileri:");
  console.log(`Token Adı: ${await token.name()}`);
  console.log(`Token Sembolü: ${await token.symbol()}`);
  console.log(`Toplam Arz: ${hre.ethers.utils.formatEther(await token.totalSupply())} BBB`);
  console.log(`Sahip: ${await token.owner()}`);
  
  console.log("\n⏳ BscScan doğrulaması için 10 saniye bekleniyor...");
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  try {
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [],
    });
    console.log("✅ Kontrat BscScan'de doğrulandı!");
  } catch (error) {
    console.log("⚠️ Kontrat doğrulanamadı:", error.message);
    console.log(`Manuel doğrulama için:`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${token.address}`);
  }
}

main().catch((error) => {
  console.error("❌ Hata:", error);
  process.exitCode = 1;
});
