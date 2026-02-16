// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BBBToken
 * @dev BNB Smart Chain (BEP-20) üzerinde oyun ekosistemi token'ı
 * @dev Tüm oyunlarda kullanılacak, oyuncular BBB ile alışveriş yapacak
 */
contract BBBToken is ERC20, ERC20Burnable, Ownable {
    
    mapping(address => bool) public minters;
    
    // Olaylar (Events)
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Token adı: BBB, Sembolü: BBB
     * Başlangıç arzı: 1 milyon BBB
     */
    constructor() ERC20("BBB", "BBB") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Caller is not a minter");
        _;
    }

    /**
     * @dev Yeni bir adrese token basma yetkisi verir
     * @param account Minter olarak eklenecek oyun sözleşmesi adresi
     */
    function addMinter(address account) external onlyOwner {
        require(!minters[account], "Account is already a minter");
        minters[account] = true;
        emit MinterAdded(account);
    }

    /**
     * @dev Bir adresin token basma yetkisini kaldırır
     * @param account Minter olarak çıkarılacak adres
     */
    function removeMinter(address account) external onlyOwner {
        require(minters[account], "Account is not a minter");
        minters[account] = false;
        emit MinterRemoved(account);
    }

    /**
     * @dev Yeni token basar (oyun ödülleri için)
     * @param to Token basılacak oyuncu adresi
     * @param amount Basılacak token miktarı
     */
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Token'ları yakar (oyun içi harcamalar, enflasyon kontrolü)
     * @param amount Yakılacak token miktarı
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(_msgSender(), amount);
    }
    
    /**
     * @dev Bir oyuncunun bakiyesini kontrol eder (okuma fonksiyonu)
     * @param account Bakiye sorgulanacak adres
     * @return uint256 Bakiye miktarı
     */
    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }
    
    /**
     * @dev Toplam arzı döndürür
     * @return uint256 Toplam token arzı
     */
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }
}