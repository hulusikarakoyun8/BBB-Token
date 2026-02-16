const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BBBToken", function () {
  let BBBToken;
  let token;
  let owner;
  let addr1;
  let addr2;
  let minter;

  beforeEach(async function () {
    [owner, addr1, addr2, minter] = await ethers.getSigners();

    BBBToken = await ethers.getContractFactory("BBBToken");
    token = await BBBToken.deploy();
    await token.deployed();
  });

  describe("Dağıtım (Deployment)", function () {
    it("Token adını doğru ata", async function () {
      expect(await token.name()).to.equal("BBB");
    });

    it("Token sembolünü doğru ata", async function () {
      expect(await token.symbol()).to.equal("BBB");
    });

    it("Başlangıç arzını sahibe ver", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Sahibi doğru ata", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Minter İşlemleri", function () {
    it("Sahip yeni minter ekleyebilir", async function () {
      await token.addMinter(minter.address);
      expect(await token.minters(minter.address)).to.equal(true);
    });

    it("Sahip olmayan minter ekleyemez", async function () {
      await expect(
        token.connect(addr1).addMinter(minter.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Sahip minter'ı kaldırabilir", async function () {
      await token.addMinter(minter.address);
      await token.removeMinter(minter.address);
      expect(await token.minters(minter.address)).to.equal(false);
    });
  });

  describe("Mint İşlemleri", function () {
    it("Minter yeni token basabilir", async function () {
      await token.addMinter(minter.address);
      await token.connect(minter).mint(addr1.address, ethers.utils.parseEther("100"));
      
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.utils.parseEther("100"));
    });

    it("Minter olmayan token basamaz", async function () {
      await expect(
        token.connect(addr1).mint(addr2.address, ethers.utils.parseEther("100"))
      ).to.be.revertedWith("Caller is not a minter");
    });
  });

  describe("Yakma (Burn) İşlemleri", function () {
    it("Token yakılabilir", async function () {
      const initialSupply = await token.totalSupply();
      const burnAmount = ethers.utils.parseEther("100");
      
      await token.burn(burnAmount);
      
      const finalSupply = await token.totalSupply();
      expect(finalSupply).to.equal(initialSupply.sub(burnAmount));
    });
  });
});
