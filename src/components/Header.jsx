import React from 'react'

export default function Header({title, devName, result}) {
    return (
        <>
            <h1>{title}</h1>
            <h5>{`developed by: ${devName}`}</h5>
            <h2>{result}</h2>
        </>
    )
}