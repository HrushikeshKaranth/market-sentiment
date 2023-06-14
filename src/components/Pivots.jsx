import React, { useEffect, useState } from 'react'

function Pivots(data) {
    const [niftyData, setNiftyData] = useState(data.data.metadata)
    const [standardPivot, setStandardPivot] = useState({})
    const [camarillaPivot, setCamarillaPivot] = useState({})

    useEffect(() => {
        let pivot = parseInt((data.data.metadata.high + data.data.metadata.low + data.data.metadata.last) / 3);
        let high = data.data.metadata.high;
        let low = data.data.metadata.low;
        let close = data.data.metadata.last;
        setStandardPivot({
            P: pivot,
            R1: parseInt(pivot + (pivot - low)),
            R2: parseInt(pivot + (high - low)),
            R3: parseInt(high + 2 * (pivot - low)),
            S1: parseInt(pivot - (high - pivot)),
            S2: parseInt(pivot - (high - low)),
            S3: parseInt(low - 2 * (high - pivot))
        })
        setCamarillaPivot({
            P: pivot,
            R3: parseInt(close + (high - low) * 1.1 / 4),
            R4: parseInt(close + (high - low) * 1.1 / 2),
            S3: parseInt(close - (high - low) * 1.1 / 4),
            S4: parseInt(close - (high - low) * 1.1 / 2),
        })
    }, [])
    // console.log(niftyData);
    // console.log(standardPivot);
    // console.log(camarillaPivot);

    return (
        <>
            {data.data.metadata.indexName &&
                <div className='category'>
                    <div className="seperateSection">
                        <h1>{niftyData.indexName}</h1>
                        <div>
                            <h2>Open - {niftyData.open}</h2>
                            <h2>High - {niftyData.high}</h2>
                            <h2>Low - {niftyData.low}</h2>
                            <h2>Close - {niftyData.last}</h2>
                        </div>
                    </div>
                    <div className='divide'>
                        <div className='seperateSection'>
                            <h1>Standard Pivots</h1>
                            <div>
                                <h2>Pivot - {standardPivot.P} </h2>
                                <h2>R1 - {standardPivot.R1} </h2>
                                <h2>R2 - {standardPivot.R2} </h2>
                                <h2>R3 - {standardPivot.R3} </h2>
                                <h2>S1 - {standardPivot.S1} </h2>
                                <h2>S2 - {standardPivot.S2} </h2>
                                <h2>S3 - {standardPivot.S3} </h2>
                            </div>
                        </div>
                        <div className='seperateSection'>
                            <h1>Camarilla Pivots</h1>
                            <div>
                                <h2>Pivot - {camarillaPivot.P}</h2>
                                <h2>R3 - {camarillaPivot.R3}</h2>
                                <h2>R4 - {camarillaPivot.R4}</h2>
                                <h2>S3 - {camarillaPivot.S3}</h2>
                                <h2>S4 - {camarillaPivot.S4}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Pivots