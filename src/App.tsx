import styles from './styles/App.module.css'

import { useState, useEffect } from 'react';

interface Quote {
    author: string;
    quote: string;
}

function App() {
    const [quote, setQuote] = useState<Quote | null>(null);
    useEffect(() => {
        const async_wrapper = async () => {
            await GetQuote();
        }
        async_wrapper();
    },[])
    const GetQuote = async () => {
        const response = await fetch('https://programming-quotesapi.vercel.app/api/random')
            .then(response => response.json())
        console.log(response)
        setQuote(response)
    }
  return (
    <div>
        <button onClick={GetQuote}>Get joke</button>
        <p>Author: { quote ? quote.author: "No author"}</p>
        <p>{quote ? quote.quote: "No quote"}</p>
    </div>
  )
}

export default App
