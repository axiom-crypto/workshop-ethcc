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

    error ProofError();
    error AlreadyClaimedError();
    error InvalidSenderError();
    error InvalidDataLengthError();
    error InvalidNonceError();
    error AccountAgeBelowThresholdError();

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
        if (!valid) {
            revert ProofError();
        }

        // Decode the query metadata 
        uint256 length = response.accountResponses.length;
        if (length != 1) {
            revert InvalidDataLengthError();
        }

        // Get values for first transaction from submitted proof response struct
        uint256 blockNumber = response.accountResponses[0].blockNumber;
        uint256 nonce = response.accountResponses[0].nonce;
        address addr = response.accountResponses[0].addr;

        // Get current block
        uint256 currentBlock = block.number;

        // Check that the account nonce at the end of the bear market is a set threshold above the 
        // account nonce at the start of the bear market, since it acts as a transaction counter
        if (nonce != 1) {
            revert InvalidNonceError();
        }

        // Check that the proof submitted is for the same address that is submitting the transaction
        if (addr != _msgSender()) {
            revert InvalidSenderError();
        }

        // // Check that the start and end blocks proved match the values set in the contract
        if (currentBlock - ACCOUNT_AGE_THRESHOLD < blockNumber) {
            revert AccountAgeBelowThresholdError();
        }
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
