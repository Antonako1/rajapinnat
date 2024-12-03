import styles from './styles/App.module.css'
import { useState, useEffect } from 'react'

function App() {
    const [get_random_url, set_get_random_url] = useState<string>('')
    const [get_breeds, set_breeds] = useState<string[]>([])
    const [loading, set_loading] = useState<boolean>(true)
    const [search, set_search] = useState<string>('')
    const [selected_breed, set_selected_breed] = useState<string>('')
    const [breedurl2, set_breedurl2] = useState<string>('')
    const [breedurl3, set_breedurl3] = useState<string>('')
    useEffect(() => {
        get_random_dog()

        const async_wrapper = async () => {
            const response = await fetch('https://dog.ceo/api/breeds/list/all')
            const data = await response.json()
            const breeds = Object.keys(data.message)
            set_breeds(breeds)
            set_loading(false)
        }
        async_wrapper()
    }, [])

    const get_random_dog = async () => {
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        const data = await response.json()
        set_get_random_url(data.message)
    }

    useEffect(()=>{
        
        const async_wrapper = async () => {
            try {
                const response = await fetch(`https://dog.ceo/api/breed/${search}/images/random`)
                const data = await response.json()
                set_breedurl2(data.message)
            } catch (error) {
                // console.log(error)
            }
        }
        async_wrapper()        
    }, [search])


    useEffect(()=>{
        const async_wrapper = async () => {
            try {
                const response = await fetch(`https://dog.ceo/api/breed/${selected_breed}/images/random`)
                const data = await response.json()
                set_breedurl3(data.message)
            } catch (error) {
                // console.log(error)
            }
        }
        async_wrapper()
    },[selected_breed])

    if(loading) {
        return <div>Loading...</div>
    }


    
    return (
        <div>
            <button onClick={get_random_dog}>Random picture of a dog</button>
            
            {get_random_url && <img src={get_random_url} alt="Random dog" />}

            <br/><hr/><br/>
            <img src={breedurl2} alt="Selected dog" />
            <input 
            onChange={(e) => set_search(e.target.value)}
            type="text" placeholder="Search for a breed" />
            <br/><hr/><br/>


            <select
                value={selected_breed}
                onChange={(e) => set_selected_breed(e.target.value)}
            >
                {
                    get_breeds.map((breed, index) => (
                        <option key={index} value={breed}>{breed}</option>
                    ))
                }
            </select>
            <img src={breedurl3} alt="Selected dog" />
            
        </div>
    )
}

export default App
