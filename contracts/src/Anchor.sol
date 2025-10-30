// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Anchor
 * @dev Stores metadata hashes from another chain to verify cross-chain integrity.
 */
contract Anchor {
    struct AnchorRecord {
        bytes32 metadataHash;  // keccak256 hash of image metadata from Chain A
        address uploader;      // who anchored it
        uint256 timestamp;
    }

    mapping(string => AnchorRecord) private anchors;

    event Anchored(string indexed imageId, bytes32 metadataHash, address indexed uploader, uint256 timestamp);

    /**
     * @dev Anchor metadata from another chain
     */
    function anchorMetadata(string memory imageId, bytes32 metadataHash) public {
        require(anchors[imageId].timestamp == 0, "Already anchored");

        anchors[imageId] = AnchorRecord({
            metadataHash: metadataHash,
            uploader: msg.sender,
            timestamp: block.timestamp
        });

        emit Anchored(imageId, metadataHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify if a given metadata hash matches the anchored record
     */
    function verifyAnchor(string memory imageId, bytes32 metadataHash) public view returns (bool) {
        return anchors[imageId].metadataHash == metadataHash;
    }

    /**
     * @dev Fetch the anchored record
     */
    function getAnchor(string memory imageId) public view returns (bytes32, address, uint256) {
        AnchorRecord memory record = anchors[imageId];
        return (record.metadataHash, record.uploader, record.timestamp);
    }
}
