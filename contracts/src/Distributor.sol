// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./interfaces/IAxiomV1Query.sol";

struct ResponseStruct {
    bytes32 keccakBlockResponse;
    bytes32 keccakAccountResponse;
    bytes32 keccakStorageResponse;
    IAxiomV1Query.BlockResponse[] blockResponses;
    IAxiomV1Query.AccountResponse[] accountResponses;
    IAxiomV1Query.StorageResponse[] storageResponses;
}

contract Distributor is ERC721Enumerable {
    uint256 public constant ACCOUNT_AGE_THRESHOLD = 250;
    address public constant AXIOM_V1_QUERY_GOERLI_ADDR = 0x4Fb202140c5319106F15706b1A69E441c9536306;

    mapping (address => bool) public hasMinted;
    
    error AlreadyClaimedError();
    /**
     * TODO: Add errors for your checks (or use inline `require`, if you prefer)
     */
    
    
    constructor() ERC721("Distributor", "DST") {}

    function _validateData(ResponseStruct calldata response) private view {
        // Mainnet AxiomV1Query address
        IAxiomV1Query axiomV1Query = IAxiomV1Query(AXIOM_V1_QUERY_GOERLI_ADDR);
        
        // Check that the responses are valid
        bool valid = axiomV1Query.areResponsesValid(
            response.keccakBlockResponse,
            response.keccakAccountResponse,
            response.keccakStorageResponse,
            response.blockResponses,
            response.accountResponses,
            response.storageResponses
        );
        /**
         * TODO: Add checks to ensure that the proof is valid and that all of the data that you're 
         *       trying to prove is also valid. You can also see what a sample ResponeTree looks like 
         *       by looking at `sampleResponseTree.txt` in the root of the repo.
         */

    }

    function claim(ResponseStruct calldata response) external {
        // Ensure current address has not yet claimed their tokens
        if (hasMinted[_msgSender()]) {
            revert AlreadyClaimedError();
        }

        // Validates the incoming ResponseStruct
        _validateData(response);
        
        // Transfers tokens if ZK proof and data are valid
        hasMinted[_msgSender()] = true;
        _safeMint(_msgSender(), totalSupply());
    }
}
