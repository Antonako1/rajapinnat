/*+++
    ENCODER API, CLIPBOARD API
 ---*/
import styles from './styles/App.module.css'
import { useEffect, useState } from 'react'

function App() {
    const [getInput, setInput] = useState<string>('')
    const [getOutput, setOutput] = useState<string>('')

    const [getInput2, setInput2] = useState<string>('')
    const [getOutput2, setOutput2] = useState<string>('')

    useEffect(() => {
        const encoder = new TextEncoder();
        setOutput(encoder.encode(getInput).toString());
    }, [getInput])

    useEffect(() => {
        const decoder = new TextDecoder();
        setOutput2(
            decoder.decode(Uint8Array.from(
                getInput2.split(',').map(
                    (x) => parseInt(x)
                )
            ))
        )
    }, [getInput2])

    return (
        <div>
            <h1>Encode & Decode UTF-8 to ASCII. ENCODE ABOVE, DECODE BELOW</h1>
            <h2>Encode</h2>
            <div className='MAIN'>
                <input onChange={
                    (e) => setInput(e.target.value)
                } type="text" placeholder='Input'
                value={getInput}
                />
                <button onClick={
                    () => navigator.clipboard.writeText(getInput)
                }>Copy</button>
                <button onClick={
                    () => navigator.clipboard.readText().then(
                        (text) => setInput(text))
                }>Paste</button>
                <button
                onClick={
                    () => setInput('')
                }>Clear</button>
                
                
                <div className='EMPTY'><p>aa</p></div>


                <textarea onChange={
                    (e) => setOutput(e.target.value)
                } 
                value={getOutput}
                placeholder='Output'/>
                <button onClick={
                    () => navigator.clipboard.writeText(getOutput)
                }>Copy</button>
                <button onClick={
                    () => setOutput('')
                }>Clear</button>
            </div>




            <h2>Decode</h2>
            <div className='MAIN'>
                <textarea onChange={
                    (e) => setInput2(e.target.value)
                }
                value={getInput2}
                placeholder='Input'/>
                <button onClick={
                    () => navigator.clipboard.writeText(getInput2)
                }>Copy</button>
                <button onClick={
                    () => navigator.clipboard.readText().then(
                        (text) => setInput2(text))
                }>Paste</button>
                <button onClick={
                    () => setInput2('')
                }>Clear</button>

                <div className='EMPTY'><p>aa</p></div>

                <textarea onChange={
                    (e) => setOutput2(e.target.value)
                }
                value={getOutput2}
                placeholder='Output'/>
                <button onClick={
                    () => navigator.clipboard.writeText(getOutput2)
                }>Copy</button>
                <button onClick={
                    () => setOutput2('')
                }>Clear</button>


            </div>
        </div>

    )
}

export default App
