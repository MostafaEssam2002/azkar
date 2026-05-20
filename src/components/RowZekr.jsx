import React from 'react'
import CounterButton from './CounterButton';

const RowZekr = () => {
    return (
        <div style={{
            display: "flex",
            width:"350px",
            height:"250px"
        }}>
            <CounterButton num={100} />
        </div>
    )
}

export default RowZekr