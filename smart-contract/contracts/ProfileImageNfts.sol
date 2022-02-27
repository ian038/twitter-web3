//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProfileImageNfts is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    struct RenderToken{
        uint256 id;
        string uri;
        string space;
    }

    constructor() ERC721("ProfileImageNfts","PIN"){}

    function getAllTokens() public view returns (RenderToken[] memory) {
        uint256 latestId = _tokenIds.current();

        RenderToken[] memory items = new RenderToken[](latestId);
        for (uint256 i = 0; i < latestId; i++) {
            if (_exists(1)) {
                string memory uri = tokenURI(i);
                items[i] = RenderToken(i, uri, " ");
            }
        }
        return items;
    }

    function mint(address recipients, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipients, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
