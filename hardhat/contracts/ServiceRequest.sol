// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract ServiceContract {
    struct ServiceRequest {
        uint256 agreementID;
        string description;
        address payable client;
        address payable serviceProvider;
        uint256 agreementAmount;
        uint256 clientStake;
        uint256 serviceProviderStake;
        bool fundsReleased;
        bool completed;
        bool offerAccepted;
    }

    mapping(uint256 => ServiceRequest) public agreements;

    uint256 public numOfAgreement;

    function createEscrowAgreement(
        string memory _title,
        address payable _client,
        address payable _serviceProvider,
        uint256 _amount
    ) public payable {
        require(
            _client != address(0) && _serviceProvider != address(0),
            "Invalid client or service provider address."
        );
        require(msg.value >= _amount, "Kindly provide required Stake");

           ServiceRequest memory escrowAgreement = ServiceRequest(
            numOfAgreement,
            _title,
            _client,
            _serviceProvider,
            _amount,
            msg.value,
            0,
            false,
            false , 
            false
        );

            agreements[numOfAgreement] = escrowAgreement;

        numOfAgreement++;
    }

    function completedWork(uint256 _agreementId) public {
        require(
            agreements[_agreementId].serviceProvider == msg.sender,
            "Only the service provider can call this function."
        );

        agreements[_agreementId].completed = true;
    }
    
    function acceptOffer(uint256 _id) public {
        agreements[_id].offerAccepted = true;
    }

    function stakeProviderEth(uint256 _agreementId) public payable {
        require(
            agreements[_agreementId].serviceProvider == msg.sender,
            "Only the service provider can call this function."
        );

        require(
            agreements[_agreementId].serviceProviderStake == 0,
            "You have already provided stake."
        );

        require(
            agreements[_agreementId].fundsReleased == false,
            "can't stake after fund released !"
        );

        agreements[_agreementId].serviceProviderStake = msg.value;
    }

    //this function will release funds to serviceProvider for completing his work
    //also this function will refund stake of client and service provider
    function releaseFunds(uint256 _agreementId) public payable {
        require(
            agreements[_agreementId].client == msg.sender,
            "Only the client can approve release of funds."
        );
        require(
            !agreements[_agreementId].fundsReleased,
            "Funds have already been released for this escrow agreement."
        );
        require(
            agreements[_agreementId].clientStake >= 0,
            "There are no funds to release."
        );
        require(
            agreements[_agreementId].serviceProviderStake >= 0,
            "There are no funds to release."
        );

        agreements[_agreementId].fundsReleased = true;

        // here we realising funds to service provider for his work done and also refunding his stake whic he staked while agreement is created
        agreements[_agreementId].serviceProvider.transfer(
            agreements[_agreementId].clientStake
        );

        agreements[_agreementId].client.transfer(
            agreements[_agreementId].serviceProviderStake
        );
    }
 
    function cancel(uint256 _agreementId) public {
        require(
            agreements[_agreementId].client == msg.sender,
            "Only the client can cancel the escrow agreement."
        );
        require(
            !agreements[_agreementId].fundsReleased,
            "Funds have already been released for this escrow agreement."
        );
        require(
            agreements[_agreementId].clientStake >= 0,
            "There are no funds to return."
        );
        agreements[_agreementId].client.transfer(
            agreements[_agreementId].clientStake
        );
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
