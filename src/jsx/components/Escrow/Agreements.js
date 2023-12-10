import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import PageTitle from '../../layouts/PageTitle';
import Table from 'react-bootstrap/Table';
import { Badge, Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EscrowContext } from '../EscrowContext/EscrowContext';
import { Web3Context } from '../../../context/Web3Context';
export default function Agreements() {
    const escrowContext = React.useContext(EscrowContext);
    const web3context = React.useContext(Web3Context);

    const { shortAddress } = web3context;
    const { everyAgreementProvider, allReqData, releasePayment, acceptOffer, providerStake, sbmtWork, everyAgreementClient, stakeCcipProvider, submitWork, releaseFund, raiseDispute, cancel } = escrowContext;
    const [providerStaked, setProviderStaked] = useState(false);
    const [workStatus, setWorkStatus] = useState('pending');
    const [fundsReleased, setFundsReleased] = useState(false);
    const [fundReceived, setFundreceived] = useState(false)

    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );
        return (
            <button
                type="button"
                style={{ backgroundColor: 'white', border: "none", width: "100%" }}
                onClick={decoratedOnClick}
            >
                {children}
            </button>
        );
    }

    const handleSubmitWork = () => {
        setWorkStatus('done');
    };

    const handleCancelWork = () => {
        setWorkStatus('canceled');
    };

    const handleDispute = () => {
        setWorkStatus('disputed');
    };

    const handleReleaseFund = () => {
        // setWorkStatus('fundsReleased');
        setFundsReleased(true);
        setFundreceived(true)
    };

    // useEffect(() => {
    //     // console.log('everyAgreement', everyAgreement);
    //     // fetchAllAgreements();
    //     everyAgreement.map((e) => {
    //         // console.log('-----', e);
    //     })
    // }, [everyAgreement])





    return (
        <>
            <Table >
                <thead>
                    <tr >
                        <th>#Id</th>
                        {/* <th>Title</th> */}
                        <th>Address</th>
                        <th>Budget</th>
                        <th>Offers</th>
                    </tr>
                </thead>
            </Table>

            {



                allReqData && allReqData?.map((Agreement) => {

                    return (
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <CustomToggle eventKey="0">
                                        <Table borderless>
                                            <tbody>
                                                <tr>
                                                    <><td
                                                        style={{ marginRight: "33px" }}
                                                    >{Agreement?.agreementID}</td>
                                                        {/* <td>{Agreement?.title}</td> */}
                                                        <td>{shortAddress(Agreement?.client)}</td>
                                                        <td>{Agreement?.agreementAmount} </td>

                                                        <td>4 </td></>

                                                </tr>
                                            </tbody>
                                        </Table>
                                    </CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">

                                    <Card.Body>

                                        <Row className="d-flex align-items-center">
                                            <Col xl="5" className="mx-auto mb-4">
                                                <Card style={{
                                                    maxWidth: '500px',
                                                    backgroundColor: "#f4effe"
                                                    // backgroundColor:"#e1daee"
                                                }}>
                                                    <Card.Header>
                                                        <Card.Title>About requested service</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body className=" mb-0">
                                                        <p className='text-black'> Address: {shortAddress(Agreement?.client)}</p>
                                                        <p className='text-black'>
                                                            Budget Amount : {Agreement?.agreementAmount}
                                                        </p>


                                                        <div>
                                                            <p className='text-black'>
                                                                Description :
                                                                {Agreement?.description}
                                                            </p>
                                                        </div>


                                                        {Agreement?.completed === true ? (

                                                            <div>
                                                                <h5>Work status   <span className="badge light badge-success">Done</span></h5>
                                                                {
                                                                    Agreement?.fundsReleased === true ? (
                                                                        <h5 className='mt-4'>  Fund released {" "}
                                                                            <Badge bg="" className="light badge-success">Yes</Badge>
                                                                        </h5>
                                                                    ) :
                                                                        <><h5 className='mt-4'>  Fund released {" "}
                                                                            <Badge bg="" className="light badge-danger">NO</Badge>
                                                                        </h5>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-primary btn-sm mt-2"
                                                                                onClick={() => releasePayment(Agreement?.agreementID)}
                                                                            >
                                                                                Release Fund
                                                                            </button>
                                                                        </>

                                                                }

                                                            </div>

                                                        ) : (
                                                            ""
                                                        )}

                                                    </Card.Body>

                                                </Card>
                                            </Col>

                                            {
                                                Agreement?.offerAccepted === false ? (
                                                    <Col xl="5" className="mx-auto">
                                                        <Card
                                                            //  className="bg-light"
                                                            style={{ width: '460px', backgroundColor: "#f4effe" }}>
                                                            <Card.Header>
                                                                <Card.Title>Offers on Service</Card.Title>
                                                            </Card.Header>
                                                            <Card.Body>
                                                                <ul>
                                                                    <li onClick={() => acceptOffer(Agreement?.agreementID)} className='m-2'><small>0x3efCb574c30f02aDC54E035c04bF35FC731a9899</small> : 0.025 <button style={{ marginLeft: "1px" }} type="button" class="btn btn-primary btn-sm">Accept </button></li>
                                                                    <li onClick={() => acceptOffer(Agreement?.agreementID)} className='m-2'><small>0x3efCb574c30f02aDC54E035c04bF35FC731a9899</small> : 0.02 <button style={{ marginLeft: "1px" }} type="button" class="btn btn-primary btn-sm">Accept </button></li>
                                                                    <li onClick={() => acceptOffer(Agreement?.agreementID)} className='m-2'><small>0x3efCb574c30f02aDC54E035c04bF35FC731a9899</small> : 0.015 <button style={{ marginLeft: "1px" }} type="button" class="btn btn-primary btn-sm">Accept </button></li>
                                                                    <li onClick={() => acceptOffer(Agreement?.agreementID)} className='m-2'><small>0x3efCb574c30f02aDC54E035c04bF35FC731a9899</small> : 0.022 <button style={{ marginLeft: "1px" }} type="button" class="btn btn-primary btn-sm">Accept </button></li>

                                                                </ul>

                                                            </Card.Body>

                                                        </Card>
                                                    </Col>
                                                ) : (
                                                    <Col xl="5" className="mx-auto">
                                                        <Card
                                                            //  className="bg-light"
                                                            style={{ maxWidth: '800px', backgroundColor: "#f4effe" }}>
                                                            <Card.Header>
                                                                <Card.Title>Service Provider Info</Card.Title>
                                                            </Card.Header>
                                                            <Card.Body className=" mb-0">
                                                                <p className='text-black'> Address: {shortAddress(Agreement?.serviceProvider)}</p>
                                                                <p className='text-black'>
                                                                    Staked Amount : {Agreement?.serviceProviderStake} CCIP
                                                                </p>



                                                                {
                                                                    Agreement?.serviceProviderStake === "0.0" ? (
                                                                        <button type="button" class="btn btn-primary btn-sm mt-3"
                                                                            onClick={() => providerStake(Agreement?.agreementID, Agreement?.agreementAmount)}>Stake Token</button>
                                                                    ) : (
                                                                        ""
                                                                    )
                                                                }
                                                                {
                                                                   Agreement?.serviceProviderStake !== "0.0" && Agreement?.completed === false ? (
                                                                        <button type="button" class="btn btn-primary btn-sm mt-3"
                                                                            onClick={() => sbmtWork(Agreement?.agreementID, Agreement?.agreementAmount)}>Submit work</button>
                                                                    ) : (
                                                                        ""
                                                                    )
                                                                }



                                                                {Agreement?.completed === true ? (

                                                                    <div>
                                                                        <h5>Work status   <span className="badge light badge-success">Done</span></h5>
                                                                        {
                                                                            Agreement?.fundsReleased === true ? (
                                                                                <h5 className='mt-4'>  Fund Recieved {" "}
                                                                                    <Badge bg="" className="light badge-success">Received</Badge>
                                                                                </h5>
                                                                            ) : <h5 className='mt-4'>  Fund Recieved {" "}
                                                                                <Badge bg="" className="light badge-danger">NO</Badge>
                                                                            </h5>

                                                                        }

                                                                    </div>

                                                                ) : (
                                                                    ""
                                                                )}




                                                            </Card.Body>
                                                            <Card.Footer className=" bg-transparent border-0 text-white">
                                                                {Agreement?.providerStake !== "0.0" ? (

                                                                    <div>
                                                                        {Agreement?.workSubmitted === true ? (

                                                                            <div>
                                                                                <h4>Work status   <span className="badge light badge-success">Done</span></h4>
                                                                                {
                                                                                    Agreement?.release === true ? (
                                                                                        <h4 className='mt-4'>  Fund Recieved {" "}
                                                                                            <Badge bg="" className="light badge-success">Received</Badge>
                                                                                        </h4>
                                                                                    ) : <h4 className='mt-4'>  Fund Recieved {" "}
                                                                                        <Badge bg="" className="light badge-danger">NO</Badge>
                                                                                    </h4>

                                                                                }

                                                                            </div>

                                                                        ) : (
                                                                            <div>
                                                                                <div className="row text-center mt-4">
                                                                                    <div className='col-6'>
                                                                                        {/* <button type="button" class="btn btn-primary btn-sm"
                                                                                    onClick={() => submitWork(Agreement?.agreeId)}
                                                                                >Submit Work</button> */}
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <button type="button" class="btn btn-primary"
                                                                        onClick={() => stakeCcipProvider(Agreement?.agreeId, Agreement?.agreementAmount)}>Stake Token</button>

                                                                )}

                                                            </Card.Footer>
                                                        </Card>
                                                    </Col>
                                                )
                                            }

                                        </Row>
                                    </Card.Body>


                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    )
                })

            }


        </>
    )
}
