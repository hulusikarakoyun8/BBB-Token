// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BBBToken is ERC20, ERC20Burnable, Ownable {
    
    mapping(address => bool) public minters;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("BBB", "BBB") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Caller is not a minter");
        _;
    }

    function addMinter(address account) external onlyOwner {
        require(!minters[account], "Account is already a minter");
        minters[account] = true;
        emit MinterAdded(account);
    }

    function removeMinter(address account) external onlyOwner {
        require(minters[account], "Account is not a minter");
        minters[account] = false;
        emit MinterRemoved(account);
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(_msgSender(), amount);
    }
    
    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }
    
    function getTotalSupply() external view returns (uint256) {
        return totalSupply();
    }
}
