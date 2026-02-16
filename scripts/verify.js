const hre = require("hardhat");

async function main() {
  const contractAddress = "KONTRAT_ADRESINIZI_GIRIN";
  
  console.log(`🔍 Kontrat doğrulanıyor: ${contractAddress}`);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Kontrat başarıyla doğrulandı!");
  } catch (error) {
    console.error("❌ Doğrulama hatası:", error);
  }
}

main();
