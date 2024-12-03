import styles from './styles/App.module.css'
import { useState, useEffect } from 'react'

interface Breed {
    name: string;
    origin: string;
    life_span: string;
    reference_image_id: string;
}

interface CatFact {
    fact: string;
    length: number;
}

function App() {
    const [getCats, setCats] = useState<Breed|null>(null)
    const [fact_text, setFactText] = useState<string>('')
    const [image_url, setImageUrl] = useState<string>('')

    const get_breed = async () => {
        try {
            const response = await fetch('https://api.thecatapi.com/v1/breeds')
            const data: Breed[] = await response.json()
            const random_index = Math.floor(Math.random() * data.length)
            const cat_data = data[random_index]
            setCats(cat_data)
            setImageUrl(`https://cdn2.thecatapi.com/images/${cat_data.reference_image_id}.jpg`)
        } catch (error) {
            console.log(error)
        }
    }

    const get_fact = async () => {
        try {
            const response = await fetch('https://catfact.ninja/fact')
            const data: CatFact = await response.json()
            setFactText(data.fact)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <button onClick={get_breed}>Random breed</button>
            <button onClick={get_fact}>Random fact</button>

            <div>
                <h3>Breed</h3>
                    {getCats ? (
                        <>
                        <p>Name: {getCats.name}</p>
                        <p>Life span: {getCats.life_span}</p>                        
                        <p>Origin: {getCats.origin}</p>
                        <img src={image_url} alt="cat" className={styles.cat_image} />
                        </>
                    ) : (
                        <p>No breed available</p>
                    ) }

                
            </div>
            <br></br>
            <hr></hr>

            <div>
                <h3>Fact</h3>
                <p>{
                    fact_text.length > 0 ? fact_text : 'No fact available'
                    }</p>
            </div>
        </div>
    )
}

export default App
