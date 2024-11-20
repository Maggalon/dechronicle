// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeChronicle is ERC721URIStorage {
    uint256 private tokenId;

    // Base URI required to interact with IPFS
    string private _baseURIExtended;

    constructor() ERC721("DeChronicleNFT", "CRNFT") {
        _setBaseURI("");
    }

    // Sets the base URI for the collection
    function _setBaseURI(string memory baseURI) private {
        _baseURIExtended = baseURI;
    }

    // Overrides the default function to enable ERC721URIStorage to get the updated baseURI
    function _baseURI() internal view override returns (string memory) {
        return _baseURIExtended;
    }

    // Allows minting of a new NFT 
    function mintCollectionNFT(address collector, string memory metadataURI) public {

        tokenId += 1;
        _safeMint(collector, tokenId);
        _setTokenURI(tokenId, metadataURI);

    }

}

// 0x5FbDB2315678afecb367f032d93F642f64180aa3