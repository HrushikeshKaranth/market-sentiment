import { useEffect, useState } from "react";
import './app.css';

function App() {
  const [data, setData] = useState({
    sgx: '', nifty: '', usdinr: '', usdinrcur: '', dow: '', dowcur: ''
  })
  const [calData, setCalData] = useState({
    nifty: '', usdinr: '', dow: ''
  });

  useEffect(() => {
    setCalData(
      {
        ...calData,
        nifty: parseFloat(((data.sgx - data.nifty) / data.nifty) * 100).toFixed(2),
        usdinr: parseFloat(((data.usdinrcur - data.usdinr) / data.usdinr) * 100).toFixed(2),
        dow: parseFloat(((data.dowcur - data.dow) / data.dow) * 100).toFixed(2),
      });
  }, [data])

  function setChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  console.log(data);
  return (
    <div className="app">
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
  );
}

export default App;
