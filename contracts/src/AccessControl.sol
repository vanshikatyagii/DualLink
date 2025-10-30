// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AccessControl
 * @dev Generic access control contract for managing user permissions.
 */
contract AccessControl {
    // Mapping: user address → mapping of resourceId → access (true/false)
    mapping(address => mapping(string => bool)) private accessRights;

    event AccessGiven(address indexed user, string resourceId);
    event AccessRevoked(address indexed user, string resourceId);

    /**
     * @dev Grant access for a specific user to a resource
     */
    function grantAccess(address user, string memory resourceId) public {
        require(!accessRights[user][resourceId], "Access already granted");
        accessRights[user][resourceId] = true;
        emit AccessGiven(user, resourceId);
    }

    /**
     * @dev Revoke access for a specific user from a resource
     */
    function revokeAccess(address user, string memory resourceId) public {
        require(accessRights[user][resourceId], "Access not granted");
        accessRights[user][resourceId] = false;
        emit AccessRevoked(user, resourceId);
    }

    /**
     * @dev Check if a user has access to a resource
     */
    function hasAccess(address user, string memory resourceId) public view returns (bool) {
        return accessRights[user][resourceId];
    }
}
