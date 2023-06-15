import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { indFormat } from '../indFormat';

function BankNifty() {

    const optionChainBN = 'https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY';
    const [selectedStrike, setSelectedStrike] = useState()
    const [optionChain, setOptionChain] = useState([])
    const [priceData, setPriceData] = useState([])
    const [overallStrikeData, setOverallStrikeData] = useState([])
    const [selectedStrikeData, setSelectedStrikeData] = useState([])
    const [marketData, setMarketData] = useState([])
    const [overallChangeInOI, setOverallChangeInOI] = useState()
    const [overallChangeInOICE, setOverallChangeInOICE] = useState()
    const [overallChangeInOIPE, setOverallChangeInOIPE] = useState()
    const [overallOI, setOverallOI] = useState()
    const [overallOICE, setOverallOICE] = useState()
    const [overallOIPE, setOverallOIPE] = useState()
    const [marketDataN, setMarketDataN] = useState([])

    async function getOptionChainData() {
        await axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY')
            .then((res) => {
                // console.log(res.data);
                selectedStrike ? setSelectedStrike(selectedStrike) : setSelectedStrike(Math.round(res.data.records.underlyingValue / 100) * 100);
                setOptionChain(res.data.filtered);
                setPriceData(res.data.records);
                let filtered = [];
                for (let i = 0; i < res.data.filtered.data.length; i++) {
                    if (res.data.filtered.data[i].strikePrice == selectedStrike) {
                        // console.log(res.data.filtered.data[i]);
                        setSelectedStrikeData(res.data.filtered.data[i])
                        let till = i + 2;
                        let arr = [];
                        for (let j = i > 2 ? i - 2 : 0; j <= till; j++) {
                            arr.push(res.data.filtered.data[j])
                        }
                        setOverallStrikeData({ ...arr })
                        setOverallChangeInOI(
                            ((
                                arr[0].PE.changeinOpenInterest +
                                arr[1].PE.changeinOpenInterest +
                                arr[2].PE.changeinOpenInterest +
                                arr[3].PE.changeinOpenInterest +
                                arr[4].PE.changeinOpenInterest
                            )
                                -
                                (
                                    arr[0].CE.changeinOpenInterest +
                                    arr[1].CE.changeinOpenInterest +
                                    arr[2].CE.changeinOpenInterest +
                                    arr[3].CE.changeinOpenInterest +
                                    arr[4].CE.changeinOpenInterest
                                ))
                        )
                        setOverallChangeInOICE(
                            (
                                arr[0].CE.changeinOpenInterest +
                                arr[1].CE.changeinOpenInterest +
                                arr[2].CE.changeinOpenInterest +
                                arr[3].CE.changeinOpenInterest +
                                arr[4].CE.changeinOpenInterest
                            )
                        )
                        setOverallChangeInOIPE(
                            (
                                arr[0].PE.changeinOpenInterest +
                                arr[1].PE.changeinOpenInterest +
                                arr[2].PE.changeinOpenInterest +
                                arr[3].PE.changeinOpenInterest +
                                arr[4].PE.changeinOpenInterest
                            )
                        )


                        setOverallOI(
                            (
                                arr[0].PE.openInterest +
                                arr[1].PE.openInterest +
                                arr[2].PE.openInterest +
                                arr[3].PE.openInterest +
                                arr[4].PE.openInterest
                            )
                            -
                            (
                                arr[0].CE.openInterest +
                                arr[1].CE.openInterest +
                                arr[2].CE.openInterest +
                                arr[3].CE.openInterest +
                                arr[4].CE.openInterest
                            )
                        )

                        setOverallOICE(
                            (
                                arr[0].CE.openInterest +
                                arr[1].CE.openInterest +
                                arr[2].CE.openInterest +
                                arr[3].CE.openInterest +
                                arr[4].CE.openInterest
                            )
                        )
                        setOverallOIPE(
                            (
                                arr[0].PE.openInterest +
                                arr[1].PE.openInterest +
                                arr[2].PE.openInterest +
                                arr[3].PE.openInterest +
                                arr[4].PE.openInterest
                            )
                        )
                    }
                    // let filtered = res.data.filtered.data[1];
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getOptionChainData();
        const interval = setInterval(() => {
            getOptionChainData();
        }, 120000);

        return () => { clearInterval(interval) }
    }, [selectedStrike])
    // console.log(optionChain);
    return (
        <div>
            <div>
                {optionChain.data && <div className="category">
                    <div className="seperateSection">
                        {priceData && <div className="seperateSection">
                            <h1>BANKNIFTY - {priceData.underlyingValue}</h1>
                            <div>
                                <h2>Open - {priceData.index.open}</h2>
                                <h2>High - {priceData.index.high}</h2>
                                <h2>Low - {priceData.index.low}</h2>
                                <h2>Last - {priceData.index.last}</h2>
                            </div>
                        </div>}
                        <h1>Time : {priceData.timestamp}</h1>
                        <h1>Expiry: {optionChain.data[0].expiryDate} </h1>
                        <h1>Selected Strike - {selectedStrike}</h1>
                        <select onChange={(e) => { setSelectedStrike(e.target.value) }}>
                            <option hidden>Select Strike</option>
                            {optionChain.data ?
                                optionChain.data.map((list) => {
                                    return (
                                        <option key={list.strikePrice} value={list.strikePrice}>{list.strikePrice}</option>
                                    )
                                }) : <></>
                            }
                        </select>
                    </div>
                    <div className="divide">
                        <div className="table">
                            <div className="seperateSection2">
                                <h1>Selected Strike - {selectedStrike}</h1>
                                <table>
                                    <tr>
                                        <th colSpan={2} style={{ color: 'red' }}>CALLS</th>
                                        {/* <th>STRIKE</th> */}
                                        <th colSpan={2} style={{ color: 'green' }}>PUTS</th>
                                    </tr>
                                    <tr>
                                        <th>Call Total</th>
                                        <th>Call Change</th>
                                        {/* <th></th> */}
                                        <th>Put Total</th>
                                        <th>Put Change</th>
                                    </tr>
                                    {selectedStrikeData.CE && <tr>
                                        <td>{selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.openInterest * 25)} </td>
                                        <td style={selectedStrikeData.PE.changeinOpenInterest > selectedStrikeData.CE.changeinOpenInterest ? { color: 'green' } : { color: 'red' }}>
                                            {selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.changeinOpenInterest * 25)}</td>
                                        {/* <td>{selectedStrike}</td> */}
                                        <td>{selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.openInterest * 25)}</td>
                                        <td style={selectedStrikeData.PE.changeinOpenInterest > selectedStrikeData.CE.changeinOpenInterest ? { color: 'green' } : { color: 'red' }}
                                        >{selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.changeinOpenInterest * 25)}</td>
                                    </tr>}
                                </table>
                            </div>
                            <div className="seperateSection2">
                                {overallStrikeData[0] &&
                                    <h1>Selected Strikes
                                        [
                                        {overallStrikeData[0].strikePrice + ',' + ' '}
                                        {overallStrikeData[1].strikePrice + ',' + ' '}
                                        {overallStrikeData[2].strikePrice + ',' + ' '}
                                        {overallStrikeData[3].strikePrice + ',' + ' '}
                                        {overallStrikeData[4].strikePrice}
                                        ]
                                    </h1>
                                }
                                <table>
                                    <tr>
                                        <th colSpan={2} style={{ color: 'red' }}>CALLS</th>
                                        {/* <th>STRIKE</th> */}
                                        <th colSpan={2} style={{ color: 'green' }}>PUTS</th>
                                    </tr>
                                    <tr>
                                        <th>Call Total</th>
                                        <th>Call Change</th>
                                        {/* <th></th> */}
                                        <th>Put Total</th>
                                        <th>Put Change</th>
                                    </tr>
                                    {selectedStrikeData.CE && <tr>
                                        <td>{indFormat.format(overallOICE * 25)} </td>
                                        <td style={overallChangeInOIPE > overallChangeInOICE ? { color: 'green' } : { color: 'red' }}>
                                            {indFormat.format(overallChangeInOICE * 25)}</td>
                                        {/* <td>{selectedStrike}</td> */}
                                        <td>{indFormat.format(overallOIPE * 25)}</td>
                                        <td style={overallChangeInOIPE > overallChangeInOICE ? { color: 'green' } : { color: 'red' }}
                                        >{indFormat.format(overallChangeInOIPE * 25)}</td>
                                    </tr>}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default BankNifty