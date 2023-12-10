import React, { useState, createContext, useEffect, useRef } from "react";
import { ethers } from 'ethers';
import { CCIP_TOKEN_ABI, ESCROW_ABI, ESCROW_SENDER_CONTRACT_ADDRESS, ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, CCIP_TOKEN_ADDRESS_MUMBAI, CCIP_TOKEN_ADDRESS_SEPOLIA, ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, CCIP_TOKEN_ADDRESS_FUJI, SERVICE_REQUEST_ADDRESS_CELO, SERVICE_REQ_ABI } from "../../../constants";
export const EscrowContext = createContext(undefined);


export const EscrowContextProvider = (props) => {

    const [everyAgreementClient, setEveryAgreementClient] = useState([]);
    const [everyAgreementProvider, setEveryAgreementProvider] = useState([]);
    const [allReqData, setAllReqData] = useState([]);
    const [totalNumOfAgreement, setTotalNumOfAgreements] = useState(0);
    const [numOfReq, setNumOfReq] = useState(0);

    useEffect(() => {
        gteNumOfReq()
        if (numOfReq > 0) {
            getAllReqData();
        }
    }, [numOfReq])

    const getNumOfAgreements = async () => {
        try {
            const provider = await getProviderOrSigner();
            const network = await provider.getNetwork();
            let escroContract;
            if (network?.chainId == 11155111) {
                escroContract = getEscrowContractInstance(ESCROW_SENDER_CONTRACT_ADDRESS, provider);
            } else if (network?.chainId == 80001) {
                escroContract = getEscrowContractInstance(ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, provider);
            } else if (network?.chainId == 43113) {
                escroContract = getEscrowContractInstance(ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, provider);
                // alert('Please connect to Sepolia or Mumbai network')
            }
            let num = await escroContract?.numOfAgreement();
            setTotalNumOfAgreements(Number(num))
            return Number(num);
        } catch (error) {
            console.log(error);
        }
    };
    const gteNumOfReq = async () => {
        try {
            const provider = await getProviderOrSigner();
            let escroContract = getServiceReqInstance(provider);
            let num = await escroContract?.numOfAgreement();
            setNumOfReq(Number(num))
            return Number(num);
        } catch (error) {
            console.log(error);
        }
    };

    const getProviderOrSigner = async (needSigner = false) => {
        try {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            // providers.Web3Provider(window.ethereum);
            if (needSigner) {
                const signer = await web3Provider.getSigner();
                return signer;
            }
            return web3Provider;
        } catch (error) {
            console.log(error);
        }

    }
    const getCCIPTokenContractInstance = (_tokenAddress, providerOrSigner) => {
        return new ethers.Contract(
            _tokenAddress,
            CCIP_TOKEN_ABI,
            providerOrSigner
        );
    };
    const getServiceReqInstance = (providerOrSigner) => {
        return new ethers.Contract(
            SERVICE_REQUEST_ADDRESS_CELO,
            SERVICE_REQ_ABI,
            providerOrSigner
        );
    };
    const getEscrowContractInstance = (_contractAddress, providerOrSigner) => {
        return new ethers.Contract(
            _contractAddress,
            ESCROW_ABI,
            providerOrSigner
        );
    };




    function ParsedAgreement(_agreeId, _AgreementTitle, _clientAdd, _providerAdd, _arbitrator, _agreementAmount, _clientStake, _providerStake, _released, _fundReceiver, _dispute, _workSubmitted, _crossChain) {
        this.agreeId = _agreeId;
        this.title = _AgreementTitle;
        this.clientAdd = _clientAdd;
        this.providerAdd = _providerAdd;
        this.arbitratorAdd = _arbitrator;
        this.agreementAmount = _agreementAmount;
        this.clientStake = _clientStake;
        this.providerStake = _providerStake;
        this.release = _released;
        this.fundReceiver = _fundReceiver;
        this.dispute = _dispute;
        this.workSubmitted = _workSubmitted;
        this.crossChain = _crossChain
    }
    const fetchAllAgreements = async () => {
        try {
            const provider = await getProviderOrSigner();
            const network = await provider.getNetwork();
            let chainId = network?.chainId
            const allAgrmnt = [];
            for (let i = 1; i <= totalNumOfAgreement; i++) {
                const agreement = await fetchAgreementById(i);
                console.log(agreement);
                allAgrmnt.push(agreement);

            }
            if (chainId == 80001) {
                setEveryAgreementProvider(allAgrmnt)

            } else if (chainId == 43113) {
                setEveryAgreementProvider(allAgrmnt)

            } else {
                setEveryAgreementClient(allAgrmnt);

            }

        } catch (error) {
            console.log(error);
        }
    }
 
    async function getAllReqData() {
        const provider = await getProviderOrSigner();
        let contract = getServiceReqInstance(provider);
        const numAgreements = await contract.numOfAgreement();

        const agreementsData = [];
        for (let i = 0; i < numAgreements; i++) {
            const agreement = await contract.agreements(i);
            console.log(agreement);
            agreementsData.push({
                agreementID: Number(agreement[0]),
                description: agreement[1],
                client: agreement[2],
                serviceProvider: agreement[3],
                agreementAmount: ethers.formatEther(agreement[4]),
                clientStake: ethers.formatEther(agreement[5]),
                serviceProviderStake: ethers.formatEther(agreement[6]),
                fundsReleased: agreement[7],
                completed: agreement[8],
                offerAccepted: agreement[9]
            });
        }
        setAllReqData(agreementsData);
        console.log(agreementsData);
    }
 
        const fetchAgreementById = async (id) => {

            try {
                const provider = await getProviderOrSigner();
                const network = await provider.getNetwork();

                let escroContract;
                if (network?.chainId == 11155111) {
                    escroContract = getEscrowContractInstance(ESCROW_SENDER_CONTRACT_ADDRESS, provider);
                } else if (network?.chainId == 80001) {
                    escroContract = getEscrowContractInstance(ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, provider);
                } else {
                    escroContract = getEscrowContractInstance(ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, provider);

                    // alert('Please connect to Sepolia or Mumbai network')
                }
                let agreement = await escroContract.agreements(id);
                // console.log(agreement);
                let isDispute = await escroContract.isDisputed(id);
                let isSubmitted = await escroContract.isWorkSubmitted(id);
                let getCSA = await escroContract.getCSAData(id);
                // console.log(getCSA);
                const agrmt = new ParsedAgreement(Number(agreement.agreementID), agreement.title, getCSA[0], getCSA[1], getCSA[2], ethers.formatEther(agreement?.agreementAmount), ethers.formatEther(agreement.clientStake), ethers.formatEther(agreement.serviceProviderStake), agreement.fundsReleased, Number(agreement.fundreceiver), isDispute, isSubmitted, agreement.crossChains)

                return agrmt;

            } catch (error) {
                console.log(error);
            };
        }

        const stakeCcipProvider = async (_agreementId, _agreementAmount) => {


            try {
                const provider = await getProviderOrSigner();
                const signer = await getProviderOrSigner(true);

                const network = await provider.getNetwork();
                let ccipInstance;
                let escroContract;

                if (network?.chainId == 80001) {
                    ccipInstance = getCCIPTokenContractInstance(CCIP_TOKEN_ADDRESS_MUMBAI, signer);
                    const tx = await ccipInstance.approve(ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, ethers.parseEther(_agreementAmount))
                    await tx.wait();

                    escroContract = getEscrowContractInstance(ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, signer);

                    const txx = await escroContract.stakeProviderEth(_agreementId, ESCROW_SENDER_CONTRACT_ADDRESS, CCIP_TOKEN_ADDRESS_MUMBAI);
                    await txx.wait();


                } else if (network?.chainId == 43113) {
                    ccipInstance = getCCIPTokenContractInstance(CCIP_TOKEN_ADDRESS_FUJI, signer);
                    const tx = await ccipInstance.approve(ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, ethers.parseEther(_agreementAmount))
                    await tx.wait();

                    escroContract = getEscrowContractInstance(ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, signer);

                    const txx = await escroContract.stakeProviderEth(_agreementId, ESCROW_SENDER_CONTRACT_ADDRESS, CCIP_TOKEN_ADDRESS_FUJI);
                    await txx.wait();
                    // alert('Please connect to Sepolia or Mumbai network')
                }
            } catch (error) {
                console.log(error);
            }
            fetchAllAgreements();
            alert('CCIP staked successfully.');
        }

        const submitWork = async (_agreementId) => {
            try {
                const provider = await getProviderOrSigner();
                const signer = await getProviderOrSigner(true);

                const network = await provider.getNetwork();

                if (network?.chainId == 80001) {
                    const escroContract = getEscrowContractInstance(ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, signer);

                    const txx = await escroContract.SubmitWork(_agreementId, ESCROW_SENDER_CONTRACT_ADDRESS);
                    await txx.wait();
                } else if (network?.chainId == 43113) {
                    const escroContract = getEscrowContractInstance(ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, signer);

                    const txx = await escroContract.SubmitWork(_agreementId, ESCROW_SENDER_CONTRACT_ADDRESS);
                    await txx.wait();
                }

            } catch (error) {
                console.log(error);
            }
            fetchAllAgreements();
            alert('Submitted work successfully.');
        }
        const releaseFund = async (_agreementId, _crossChain) => {
            console.log(_agreementId, _crossChain);
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getEscrowContractInstance(ESCROW_SENDER_CONTRACT_ADDRESS, signer);

                if (_crossChain == "Fuji") {
                    const txx = await escroContract.releaseFunds(_agreementId, ESCROW_FUJI_RECEIVER_CONTRACT_ADDRESS, CCIP_TOKEN_ADDRESS_SEPOLIA);
                    await txx.wait();
                } else if (_crossChain == "Mumbai") {
                    const txx = await escroContract.releaseFunds(_agreementId, ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, CCIP_TOKEN_ADDRESS_SEPOLIA);
                    await txx.wait();
                }

            } catch (error) {
                console.log(error);
            }
            fetchAllAgreements();
            alert('Fund released successfully.');

        }

        const raiseDispute = async (_agreementId, _client, _serviceProvider) => {
            const signer = await getProviderOrSigner(true);
            try {
                if (localStorage.getItem('address') == _client) {
                    const escroContract = getEscrowContractInstance(ESCROW_SENDER_CONTRACT_ADDRESS, signer);
                    const txx = await escroContract.setDispute(_agreementId, ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS);
                    await txx.wait();
                } else if (localStorage.getItem('address') == _serviceProvider) {
                    const escroContract = getEscrowContractInstance(ESCROW_MUMBAI_RECEIVER_CONTRACT_ADDRESS, signer);
                    const txx = await escroContract.setDispute(_agreementId, ESCROW_SENDER_CONTRACT_ADDRESS);
                    await txx.wait();
                } else {
                    // alert('please connect to the sepolia or mumbai testnet network!')
                }

            } catch (error) {
                console.log(error);
            }
        }

        const cancel = async (_agreementId) => {
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getEscrowContractInstance(ESCROW_SENDER_CONTRACT_ADDRESS, signer);

                const txx = await escroContract.cancel(_agreementId);
                await txx.wait();
            } catch (error) {
                console.log(error);
            }
            fetchAllAgreements();
            alert('Cancel Agreement successfully.');
        }


        const makeReq = async (_desc,amount) => {
            let address;
            if (window.ethereum) {
                window.ethereum.request({ method: 'eth_requestAccounts' })
                  .then((accounts) => {
                     address = accounts[0];
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              } else {
                console.error('MetaMask not detected. Please install MetaMask to use this application.');
              }
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getServiceReqInstance(signer);
                let addr = localStorage.getItem('address');
                const txx = await escroContract.createEscrowAgreement(_desc, address, "0x3efCb574c30f02aDC54E035c04bF35FC731a9899", ethers.parseEther("0.001"), { value: ethers.parseEther(amount.toString()) })
                await txx.wait();
                getAllReqData();
            } catch (error) {
                console.log(error);
            }
        }


        const acceptOffer = async (_id) => {
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getServiceReqInstance(signer);
                const txx = await escroContract.acceptOffer(_id)
                await txx.wait();
                getAllReqData();
            } catch (error) {
                console.log(error);
            }
        }

        const providerStake = async (_id, _value) => {
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getServiceReqInstance(signer);
                const txx = await escroContract.stakeProviderEth(_id, { value: ethers.parseEther(_value.toString()) })
                await txx.wait();
                getAllReqData();
            } catch (error) {
                console.log(error);
            }
        }
        const sbmtWork = async (_id, _value) => {
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getServiceReqInstance(signer);
                const txx = await escroContract.completedWork(_id)
                await txx.wait();
                getAllReqData();
            } catch (error) {
                console.log(error);
            }
        }

        const releasePayment = async (_id) => {
            try {
                const signer = await getProviderOrSigner(true);

                const escroContract = getServiceReqInstance(signer);
                const txx = await escroContract.releaseFunds(_id)
                await txx.wait();
                getAllReqData();
            } catch (error) {
                console.log(error);
            }
        }

        

        return (
            <EscrowContext.Provider
                value={{

                    getProviderOrSigner,
                    getEscrowContractInstance,
                    getCCIPTokenContractInstance,
                    fetchAgreementById,
                    everyAgreementClient,
                    fetchAllAgreements,
                    stakeCcipProvider,
                    submitWork,
                    releaseFund,
                    raiseDispute,
                    getNumOfAgreements,
                    everyAgreementProvider,
                    cancel,
                    makeReq,
                    allReqData,
                    acceptOffer,
                    providerStake,
                    getAllReqData,
                    sbmtWork,
                    releasePayment

                }}

                {...props}
            >
                {props.children}
            </EscrowContext.Provider>
        )
    }
