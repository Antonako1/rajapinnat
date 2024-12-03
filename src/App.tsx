import styles from './styles/App.module.css'
import { useState } from 'react'

function App() {
    const [text, setText] = useState("")
    return (
        <div>
            <input 
                type="text" 
                placeholder='Kirjoita jotain'
                onChange={(e) => setText(e.target.value)}    
            />
            <button
                onClick={() => navigator.clipboard.writeText(text)}
            >Kopioi leikepöydälle</button>

            <input type='text' placeholder='Pasteta'/>
        </div>
    )
}

export default App
