import axios from "./axios";
import { useEffect, useState } from "react";
import { indFormat } from "./indFormat";
import './app.css';
import Pivots from "./components/Pivots";
import BankNifty from "./components/BankNifty";
import FinNifty from "./components/FinNifty";

function App() {
  const [data, setData] = useState({
    sgx: '', nifty: '', usdinr: '', usdinrcur: '', dow: '', dowcur: '', close: '', high: '', low: '',
  })
  const [calData, setCalData] = useState({
    nifty: '', usdinr: '', dow: ''
  });
  const [pivots, setPivots] = useState({
    p: '', s1: '', s2: '', s3: '', s4: '', r1: '', r2: '', r3: '', r4: ''
  })

  const [advdec, setAdvdec] = useState({
    advance:'', decline:''
  })
  const [stocksData, setStocksData] = useState({})

  const [selectedStrike, setSelectedStrike] = useState();
  const [perc, setPerc] = useState({
    posPerc:0, negPerc:0, netPerc:0
  })

  useEffect(() => {
    setCalData(
      {
        ...calData,
        nifty: parseFloat(((data.sgx - data.nifty) / data.nifty) * 100).toFixed(2),
        usdinr: parseFloat(((data.usdinrcur - data.usdinr) / data.usdinr) * 100).toFixed(2),
        dow: parseFloat(((data.dowcur - data.dow) / data.dow) * 100).toFixed(2),
      });
  }, [data])

  const [optionsChain, setOptionsChain] = useState([])
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

  useEffect(() => {
    // axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY')
    getMData();
    getOIData();
    const interval = setInterval(() => {
      getOIData();
    }, 60000);

    return () => { clearInterval(interval) }
  }, [selectedStrike])

  const marketDataUrl = 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050'
  const marketDataBNUrl = 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20BANK'
  const demo = 'https://www.nseindia.com/json/gainerLossersValue.json  '
  const insiderTradingLink = 'https://www.nseindia.com/companies-listing/corporate-filings-insider-trading'
  const optionChainBN = 'https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY'
  const optionChainFN = 'https://www.nseindia.com/api/option-chain-indices?symbol=FINNIFTY'

  function getMData() {
    axios.get(marketDataUrl)
      .then((res) => {
        setMarketDataN(res.data);
        // console.log(res.data);
        setAdvdec({...data, advance:res.data.advance.advances, decline:res.data.advance.declines, unchanged:res.data.advance.unchanged})
        setStocksData(res.data.data)
        // console.log(res.data.data);
        let net = 0, pos = 0, neg = 0;
        for (let i = 1; i < res.data.data.length; i++) {
          if(res.data.data[i].pChange>0){
            pos = pos + Number((res.data.data[i].lastPrice * res.data.data[i].pChange)/100)
          }
          else{
            neg = neg - Number((res.data.data[i].lastPrice * res.data.data[i].pChange)/100)
          }
        }
        // console.log(perc.posPerc);
        net = pos-neg;
        setPerc({...perc, netPerc: net, posPerc:pos, negPerc: neg})
        // console.log(perc);
      })
      .catch((err) => {
        console.log(err);
      })
  }
  async function getOIData() {
    let config = {
      headers: {}
    }
    await axios.get('', config)
      .then((res) => {
        // console.log(res.data);
        // console.log(Math.round(res.data.records.underlyingValue / 50) * 50);
        selectedStrike ? setSelectedStrike(selectedStrike) : setSelectedStrike(Math.round(res.data.records.underlyingValue / 50) * 50);
        setOptionsChain(res.data.filtered);
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
        }
        console.log('Data Received!');
      })
      .catch((err) => {
        console.error(err);
        console.error('Error Receiving Data!');
      })
  }

  function setChange(e) {
    setData({ ...data, [e.target.name]: parseFloat(e.target.value) });
  }

  // console.log(data);
  // console.log(selectedStrike);
  // console.log(selectedStrikeData);
  // console.log(overallStrikeData);
  // console.log(overallChangeInOI);
  // console.log(overallOI);
  // console.log(marketDataN);

  return (
    <div className="app">
      <div>
        <div className="category">
          <div className="seperateSection">
            <h1 className="ul">Nifty's range</h1>
            <div className="subCategory">
              <h2>Max = 170 to 200 points (0.75% to >1%)</h2>
              <h2>Mid = 120 to 150 points (0.50% to 0.75%)</h2>
              <h2>Low = 60 to 80 points (0.40% to 0.50%)</h2>
            </div>
          </div>
          <div className="seperateSection">
            <h1>Notes</h1>
            <div className="subCategory">
              <h2>- Overall market sentiment/direction.</h2>
              <h2>- Open interest diff of above 30 Lakhs and increasing.</h2>
            </div>
          </div>
          <div className="seperateSection">
            <h1>Entry criterias</h1>
            <div className="subCategory">
              <h2>- Overall market sentiment.</h2>
              <h2>- Price action.</h2>
              <h2>- Open interest.</h2>
            </div>
          </div>
        </div>
        <div>
          {marketDataN.data && <Pivots data={marketDataN} />}
        </div>
        <div className="category">
          <div className="seperateSection">
            <h1>Links</h1>
            <div className="links">
              <h1><a href="https://www.nseindia.com/companies-listing/corporate-filings-insider-trading" target='_blank'> NSE Insider Trading Link ➡</a></h1>
              <h1><a href="https://www.nseindia.com/option-chain" target='_blank'> NSE Option Chain Link ➡</a></h1>
            </div>
          </div>
          <div className="seperateSection">
            <h1>Advance Decline</h1>
            <div className="links">
              <h1>Advances : {advdec.advance}</h1>
              <h1>Declines : {advdec.decline}</h1>
              <h1>Unchanged : {advdec.unchanged}</h1>
            </div>
          </div>
        </div>
        <div className="category">
          <div className="seperateSection">
            <h1>Percentage calculation</h1>
            <div className="subCategory">
              <input type="number" name="nifty" value={data.nifty} onChange={setChange} placeholder='Enter Closing Price' />
            </div>
            <div className="subCategory">
              <input type="number" name="sgx" value={data.sgx} onChange={setChange} placeholder='Enter Current Price' />
            </div>
            <div className="result">
              <h1>= {calData.nifty} %</h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        {optionsChain && optionsChain.data && <div className="category">
          <div className="seperateSection">
            {marketDataN.metadata && <div className="seperateSection">
              <h1>NIFTY 50 - {priceData.underlyingValue}</h1>
              {/* <div>
                <h2>Open - {marketDataN.metadata.open}</h2>
                <h2>High - {marketDataN.metadata.high}</h2>
                <h2>Low - {marketDataN.metadata.low}</h2>
                <h2>Last - {marketDataN.metadata.last}</h2>
              </div> */}
            </div>}
            <h1>Time : {priceData.timestamp}</h1>
            <h1>Expiry: {optionsChain.data[0].expiryDate} </h1>
            <h1>Selected Strike - {selectedStrike}</h1>
            <select onChange={(e) => { setSelectedStrike(e.target.value) }}>
              <option hidden>Select Strike</option>
              {optionsChain.data ?
                optionsChain.data.map((list) => {
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
                    <td>{selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.openInterest * 50)} </td>
                    <td style={selectedStrikeData.PE.changeinOpenInterest > selectedStrikeData.CE.changeinOpenInterest ? { color: 'green' } : { color: 'red' }}>
                      {selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.changeinOpenInterest * 50)}</td>
                    {/* <td>{selectedStrike}</td> */}
                    <td>{selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.openInterest * 50)}</td>
                    <td style={selectedStrikeData.PE.changeinOpenInterest > selectedStrikeData.CE.changeinOpenInterest ? { color: 'green' } : { color: 'red' }}
                    >{selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.changeinOpenInterest * 50)}</td>
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
                    <td>{indFormat.format(overallOICE * 50)} </td>
                    <td style={overallChangeInOIPE > overallChangeInOICE ? { color: 'green' } : { color: 'red' }}>
                      {indFormat.format(overallChangeInOICE * 50)}</td>
                    {/* <td>{selectedStrike}</td> */}
                    <td>{indFormat.format(overallOIPE * 50)}</td>
                    <td style={overallChangeInOIPE > overallChangeInOICE ? { color: 'green' } : { color: 'red' }}
                    >{indFormat.format(overallChangeInOIPE * 50)}</td>
                  </tr>}
                </table>
                {selectedStrikeData.CE && <div className='category'>
                  Difference = [{indFormat.format((overallChangeInOIPE * 50) - (overallChangeInOICE * 50))}]
                </div>}
              </div>
            </div>
          </div>
        </div>}
      </div>
      {/* <div>
        <BankNifty />
      </div>
      <div>
        <FinNifty/>
      </div> */}
    </div>
  );
}

export default App;
