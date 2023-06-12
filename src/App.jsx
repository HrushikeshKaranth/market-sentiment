import axios from "./axios";
import { useEffect, useState } from "react";
import { indFormat } from "./indFormat";
import './app.css';

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

  const [selectedStrike, setSelectedStrike] = useState()

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

  const [overallChangeInOI, setOverallChangeInOI] = useState()
  const [overallOI, setOverallOI] = useState()
  useEffect(() => {
    // axios.get('https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY')
    getOIData();
    const interval = setInterval(() => {
      getOIData();
    }, 60000);

    return () => { clearInterval(interval) }
  }, [selectedStrike])

  async function getOIData() {
    let config = {
      headers: {
        // 'Accept-Encoding': 'gzip, deflate, br',
        // 'Accept-Language': 'en-US,en-IN;q=0.9,en;q=0.8',
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      }
    }
    await axios.get('', config)
      .then((res) => {
        console.log(res.data);
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
              (
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
          }
          // let filtered = res.data.filtered.data[1];
        }
        // console.log(filtered);
        // console.log(res.data.filtered.data[1].strikePrice);
        console.log('Data Received!');
      })
      .catch((err) => {
        console.error(err);
        console.error('Error Receiving Data!');
      })
  }

  function calculatePivots() {
    let p = ((data.close + data.high + data.low) / 3);
    setPivots({
      ...pivots,
      r4: parseFloat(data.high + (3 * (p - data.low))).toFixed(2),
      r3: parseFloat(data.high + (2 * (p - data.low))).toFixed(2),
      r2: parseFloat(p + (data.high - data.low)).toFixed(2),
      r1: parseFloat(p + (p - data.low)).toFixed(2),
      s1: parseFloat(p - (data.high - p)).toFixed(2),
      s2: parseFloat(p - (data.high - data.low)).toFixed(2),
      s3: parseFloat(data.low - (2 * (data.high - p))).toFixed(2),
      s4: parseFloat(data.low - (3 * (data.high - p))).toFixed(2),
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

  return (
    <div className="app">
      <div>
        <div className="category">
          <h1>Nifty's range</h1>
          <div className="subCategory">
            <h2>Max = 170 to 200 points (0.75% to >1%)</h2>
            <h2>Mid = 120 to 150 points (0.50% to 0.75%)</h2>
            <h2>Low = 60 to 80 points (0.40% to 0.50%)</h2>
          </div>
          <h1>Notes</h1>
          <div className="subCategory">
            <h2>- Overall market sentiment/direction.</h2>
            <h2>- Open interest diff of above 30 Lakhs and increasing.</h2>
          </div>
          <h1>Entry criterias</h1>
          <div className="subCategory">
            <h2>- Overall market sentiment.</h2>
            <h2>- Price action.</h2>
            <h2>- Open interest.</h2>
          </div>
        </div>
        <div className="category">
          <h1>Standard Pivots</h1>
          <div className="subCategory">
            <input type="number" name="close" value={data.close} onChange={setChange} placeholder='Enter closing price' />
          </div>
          <div className="subCategory">
            <input type="number" name="high" value={data.high} onChange={setChange} placeholder='Enter day high price' />
          </div>
          <div className="subCategory">
            <input type="number" name="low" value={data.low} onChange={setChange} placeholder='Enter day low price' />
          </div>
          <div className="subCategory">
            <button onClick={calculatePivots}>Calculate</button>
          </div>
          <div className="result">
            <h2>R1 - {pivots.r1}</h2>
            <h2>R2 - {pivots.r2}</h2>
            <h2>R3 - {pivots.r3}</h2>
            <h2>S1 - {pivots.s1}</h2>
            <h2>S2 - {pivots.s2}</h2>
            <h2>S3 - {pivots.s3}</h2>
          </div>
        </div>
        <div className="category">
          <h1>Nifty calculation</h1>
          <div className="subCategory">
            <h2 className="text">Enter closing price of Nifty Futures</h2>
            <input type="number" name="nifty" value={data.nifty} onChange={setChange} />
          </div>
          <div className="subCategory">
            <h2>Enter current price of SGX Nifty</h2>
            <input type="number" name="sgx" value={data.sgx} onChange={setChange} />
          </div>
          <div className="result">
            <h1>{calData.nifty} %</h1>
          </div>
        </div>
        <div className="category">
          <h1>USD/INR calculation</h1>
          <div className="subCategory">
            <h2 className="text">Enter closing price of USD/INR</h2>
            <input type="number" name="usdinr" value={data.usdinr} onChange={setChange} />
          </div>
          <div className="subCategory">
            <h2>Enter current price of USD/INR</h2>
            <input type="number" name="usdinrcur" value={data.usdinrcur} onChange={setChange} />
          </div>
          <div className="result">
            <h1>{calData.usdinr} %</h1>
          </div>
        </div>
        <div className="category">
          <h1>Dow Jones calculation</h1>
          <div className="subCategory">
            <h2 className="text">Enter closing price of DOW</h2>
            <input type="number" name="dow" value={data.dow} onChange={setChange} />
          </div>
          <div className="subCategory">
            <h2>Enter current price of Dow</h2>
            <input type="number" name="dowcur" value={data.dowcur} onChange={setChange} />
          </div>
          <div className="result">
            <h1>{calData.dow} %</h1>
          </div>
        </div>
      </div>
      <div>
        {priceData &&
          <div className="category">
            <h2>Nifty: {priceData.underlyingValue}</h2>
            <h2>Time Stamp: {priceData.timestamp}</h2>
          </div>}
        <div className="category">
          <h2>Total Open Interest</h2>
          {optionsChain.CE && <div className="subCategory">
            {optionsChain.CE && <h2>CE OI: {indFormat.format(optionsChain.CE.totOI)}</h2>}
            {optionsChain.PE && <h2>PE OI: {indFormat.format(optionsChain.PE.totOI)}</h2>}
            <h2 style={
              optionsChain.PE.totOI - optionsChain.CE.totOI < 0 ? { color: 'red' } : { color: 'green' }
            }>Difference: {indFormat.format(optionsChain.PE.totOI - optionsChain.CE.totOI)}</h2>
          </div>}
        </div>

      </div>
      {optionsChain.data && <div className="category">
        <h1>
          Nifty - {priceData.underlyingValue} <br/> 
          {priceData.timestamp} <br/>
          Expiry: {optionsChain.data[0].expiryDate} <br/>
          Selected Strike: {selectedStrike}
        </h1>
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
        <div className="divide">
          <div className="category">
            CALLS
            <h2>-----------------------------------</h2>
            <h2>Total OI: {selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.openInterest)} </h2>
            <h2>Change in OI: {selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.changeinOpenInterest)}</h2>
            <h2>-----------------------------------</h2>
            <h2>Total Buy Qty: {selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.totalBuyQuantity)}</h2>
            <h2>Total Sell Qty: {selectedStrikeData.CE && indFormat.format(selectedStrikeData.CE.totalSellQuantity)}</h2>
          </div>
          <div className="category">
            PUTS
            <h2>-----------------------------------</h2>
            <h2>Total OI: {selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.openInterest)} </h2>
            <h2>Change in OI: {selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.changeinOpenInterest)}</h2>
            <h2>-----------------------------------</h2>
            <h2>Total Buy Qty: {selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.totalBuyQuantity)}</h2>
            <h2>Total Sell Qty: {selectedStrikeData.PE && indFormat.format(selectedStrikeData.PE.totalSellQuantity)}</h2>
          </div>
          {
            selectedStrikeData.CE &&
            <div className="category">
              <h1
                style={selectedStrikeData.PE.changeinOpenInterest - selectedStrikeData.CE.changeinOpenInterest > 0 ? { color: 'green' } : { color: 'red' }}
              >Change in OI : {indFormat.format(selectedStrikeData.PE.changeinOpenInterest - selectedStrikeData.CE.changeinOpenInterest)}</h1>
              <h1
                style={selectedStrikeData.PE.openInterest - selectedStrikeData.CE.openInterest > 0 ? { color: 'green' } : { color: 'red' }}
              >Total OI : {indFormat.format(selectedStrikeData.PE.openInterest - selectedStrikeData.CE.openInterest)}</h1>
            </div>
          }
          {
            selectedStrikeData.CE &&
            <div className="category">
              <h2>Buy/Sell</h2>
              <h1>BUY: {indFormat.format(selectedStrikeData.PE.totalBuyQuantity - selectedStrikeData.CE.totalBuyQuantity)}</h1>
              <h1>SELL: {indFormat.format(selectedStrikeData.PE.totalSellQuantity - selectedStrikeData.CE.totalSellQuantity)}</h1>
            </div>
          }
        </div>
      </div>}
      {overallStrikeData[0] &&
        <div className="category">
          <h2>Selected Strikes 
            [
              {overallStrikeData[0].strikePrice + ' '}, 
              {overallStrikeData[1].strikePrice + ' '}, 
              {overallStrikeData[2].strikePrice + ' '}, 
              {overallStrikeData[3].strikePrice + ' '}, 
              {overallStrikeData[4].strikePrice}
            ]
          </h2>
          <div className="divide">
            <div className="category">
              <h2>Total Overall change in OI</h2>
              <h2>----------------------</h2>
              <div className="divide">
                <div className="category">
                  <h2 style={{ color: 'red' }}>CALLS : {
                    indFormat.format(
                      (
                        overallStrikeData[0].CE.changeinOpenInterest +
                        overallStrikeData[1].CE.changeinOpenInterest +
                        overallStrikeData[2].CE.changeinOpenInterest +
                        overallStrikeData[3].CE.changeinOpenInterest +
                        overallStrikeData[4].CE.changeinOpenInterest
                      )
                    )
                  }</h2>
                  <h2 style={{ color: 'green' }}>PUTS : {
                    indFormat.format(
                      (
                        overallStrikeData[0].PE.changeinOpenInterest +
                        overallStrikeData[1].PE.changeinOpenInterest +
                        overallStrikeData[2].PE.changeinOpenInterest +
                        overallStrikeData[3].PE.changeinOpenInterest +
                        overallStrikeData[4].PE.changeinOpenInterest
                      )
                    )
                  }</h2>
                </div>
              </div>
              <h1 style={overallChangeInOI && overallChangeInOI > 0 ? { color: 'green' } : { color: 'red' }}>Difference : {overallStrikeData[0] &&
                indFormat.format(
                  overallChangeInOI && overallChangeInOI
                )
              }</h1>
            </div>
            <div className="category">
              <h2>Total Overall OI</h2>
              <h2>----------------------</h2>
              <div className="divide">
                <div className="category">
                  <h2 style={{ color: 'red' }}>CALLS : {
                    indFormat.format(
                      (
                        overallStrikeData[0].CE.openInterest +
                        overallStrikeData[1].CE.openInterest +
                        overallStrikeData[2].CE.openInterest +
                        overallStrikeData[3].CE.openInterest +
                        overallStrikeData[4].CE.openInterest
                      )
                    )
                  }</h2>
                  <h2 style={{ color: 'green' }}>PUTS : {
                    indFormat.format(
                      (
                        overallStrikeData[0].PE.openInterest +
                        overallStrikeData[1].PE.openInterest +
                        overallStrikeData[2].PE.openInterest +
                        overallStrikeData[3].PE.openInterest +
                        overallStrikeData[4].PE.openInterest
                      )
                    )
                  }</h2>

                </div>
              </div>
              <h1 style={overallOI && overallOI > 0 ? { color: 'green' } : { color: 'red' }}>Difference : {overallStrikeData[0] &&
                indFormat.format(
                  overallOI && overallOI
                )
              }</h1>
            </div>
            <div className="category">
              <h2>Total Overall Buy-Sell</h2>
              <h2>----------------------</h2>
              <div className="divide">
                <div className="category">
                  <h2>CALLS</h2>
                  <h2>-----</h2>
                  <h2> BUY : {
                    indFormat.format(
                      (
                        overallStrikeData[0].CE.totalBuyQuantity +
                        overallStrikeData[1].CE.totalBuyQuantity +
                        overallStrikeData[2].CE.totalBuyQuantity +
                        overallStrikeData[3].CE.totalBuyQuantity +
                        overallStrikeData[4].CE.totalBuyQuantity
                      )
                    )
                  }</h2>
                  <h2> SELL : {
                    indFormat.format(
                      (
                        overallStrikeData[0].CE.totalSellQuantity +
                        overallStrikeData[1].CE.totalSellQuantity +
                        overallStrikeData[2].CE.totalSellQuantity +
                        overallStrikeData[3].CE.totalSellQuantity +
                        overallStrikeData[4].CE.totalSellQuantity
                      )
                    )
                  }</h2>
                </div>
                <div className="category">
                  <h2>PUTS</h2>
                  <h2>-----</h2>
                  <h2> BUY : {
                    indFormat.format(
                      (
                        overallStrikeData[0].PE.totalBuyQuantity +
                        overallStrikeData[1].PE.totalBuyQuantity +
                        overallStrikeData[2].PE.totalBuyQuantity +
                        overallStrikeData[3].PE.totalBuyQuantity +
                        overallStrikeData[4].PE.totalBuyQuantity
                      )
                    )
                  }</h2>
                  <h2> SELL : {
                    indFormat.format(
                      (
                        overallStrikeData[0].PE.totalSellQuantity +
                        overallStrikeData[1].PE.totalSellQuantity +
                        overallStrikeData[2].PE.totalSellQuantity +
                        overallStrikeData[3].PE.totalSellQuantity +
                        overallStrikeData[4].PE.totalSellQuantity
                      )
                    )
                  }</h2>
                </div>
              </div>
              <h1>Difference : {overallStrikeData[0] &&
                indFormat.format(
                  (
                    overallStrikeData[0].PE.openInterest +
                    overallStrikeData[1].PE.openInterest +
                    overallStrikeData[2].PE.openInterest +
                    overallStrikeData[3].PE.openInterest +
                    overallStrikeData[4].PE.openInterest
                  )
                  -
                  (
                    overallStrikeData[0].CE.openInterest +
                    overallStrikeData[1].CE.openInterest +
                    overallStrikeData[2].CE.openInterest +
                    overallStrikeData[3].CE.openInterest +
                    overallStrikeData[4].CE.openInterest
                  )
                )
              }</h1>
            </div>
          </div>
        </div>}
    </div>
  );
}

export default App;
