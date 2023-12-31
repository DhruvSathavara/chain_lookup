import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Import Components
import { ThemeContext } from "../../../context/ThemeContext";
import coin from './../../../images/coin.png';

import Charts from './widgets/Charts';
import CardSlider from './widgets/CardSlider';
import CardData from './widgets/CardData';
import TxTable from './widgets/TxTable';
import Converter from './widgets/Converter';
import EscrowTable from './widgets/EscrowTable';
const Home = () => {
	const [isCssLoaded, setIsCssLoaded] = useState(false);
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
		setTimeout(() => {
			setIsCssLoaded(true);
		}, 1000);
	}, []);

	return (
		<>
			{
				!isCssLoaded ?
					<div className="loader-wrapper">
						<div className="loader"></div>
					</div>
					:
					<div className="row">
						{/* <CardSlider /> */}
						<CardData />
						{/* <Charts /> */}
						{/* <EscrowTable /> */}
						{/* <TxTable /> */}
						{/* <Converter /> */}
					</div>
			}
		</>
	)
}
export default Home;