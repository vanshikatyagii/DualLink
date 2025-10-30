// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

/**
 * @title ImageRegistry
 * @dev Stores encrypted image metadata and manages access through AccessControl.
 */
contract ImageRegistry {
    struct Image {
        address owner;
        string ipfsHash;       // Encrypted image on IPFS
        string encryptionKey;  // Encrypted key for decryption
        uint256 timestamp;
    }

    // Mapping of image ID => image metadata
    mapping(string => Image) private images;

    // Access control reference
    AccessControl private accessContract;

    event ImageUploaded(string imageId, address indexed owner, string ipfsHash);
    event AccessGranted(string imageId, address indexed grantedTo);
    event AccessRevoked(string imageId, address indexed revokedFrom);

    /**
     * @dev Pass the deployed AccessControl contract address in constructor.
     */
    constructor(address accessControlAddress) {
        require(accessControlAddress != address(0), "Invalid AccessControl address");
        accessContract = AccessControl(accessControlAddress);
    }

    /**
     * @dev Upload encrypted image metadata.
     */
    function uploadImage(
        string memory imageId,
        string memory ipfsHash,
        string memory encryptionKey
    ) public {
        require(images[imageId].timestamp == 0, "Image already exists");

        images[imageId] = Image({
            owner: msg.sender,
            ipfsHash: ipfsHash,
            encryptionKey: encryptionKey,
            timestamp: block.timestamp
        });

        emit ImageUploaded(imageId, msg.sender, ipfsHash);
    }

    /**
     * @dev Grant access to a user through AccessControl contract.
     */
    function grantAccess(string memory imageId, address user) public {
        require(images[imageId].owner == msg.sender, "Only owner can grant access");
        accessContract.grantAccess(user, imageId);
        emit AccessGranted(imageId, user);
    }

    /**
     * @dev Revoke access from a user.
     */
    function revokeAccess(string memory imageId, address user) public {
        require(images[imageId].owner == msg.sender, "Only owner can revoke access");
        accessContract.revokeAccess(user, imageId);
        emit AccessRevoked(imageId, user);
    }

    /**
     * @dev Retrieve image data (only for owner or granted users).
     */
    function getImageData(string memory imageId)
        public
        view
        returns (string memory, string memory)
    {
        Image memory img = images[imageId];
        require(img.timestamp != 0, "Image not found");

        bool isAllowed = (msg.sender == img.owner) || accessContract.hasAccess(msg.sender, imageId);
        require(isAllowed, "Access denied");

        return (img.ipfsHash, img.encryptionKey);
    }

//metadata hash
    function getMetadataHash(string memory imageId) public view returns (bytes32) {
        Image memory img = images[imageId];
        require(img.timestamp != 0, "Image not found");

        return keccak256(abi.encodePacked(img.owner, img.ipfsHash, img.encryptionKey, img.timestamp));
    }

}
