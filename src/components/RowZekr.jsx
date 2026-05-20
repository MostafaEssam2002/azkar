import React from 'react'
import CounterButton from './CounterButton';

const RowZekr = () => {
    return (
        <div style={{
            display: "flex",
            width:"150px",
            height:"250px"
        }}>
            <CounterButton num={100} id={1} />
        </div>
    )
}

export default RowZekr