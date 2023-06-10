import axios from "axios";

const instance = axios.create({
    baseURL: 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY'
})

export default instance;