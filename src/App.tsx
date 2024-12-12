import Button from './components/button'
import PokemonStat, { PokemonStats } from './components/pokemon_stat'
import styles from './styles/App.module.css'
import { useEffect, useState } from 'react'


const baseUrl = 'https://pokeapi.co/api/v2/'

const MAX_POKEMON = 1025;

const EMPTY_STATS: PokemonStats = {
    Available: false,
    Name: '',
    Index: 0,
    Type: '',
    Weight: 0,
    Height: 0,
    NormalPicUrl: '',
    ShinyPicUrl: '',
    Stats: null,
    Cries: null,
    Abilities: null
}
function App() {
    const [index, setIndex] = useState<number>(1)
    const [searchIndex, setSearchIndex] = useState<number>(0)
    const [pokemonText, setPokemonText] = useState<string>('')
    const [stats, setStats] = useState<PokemonStats>({
        Available: false,
        Name: '',
        Index: 0,
        Type: '',
        Weight: 0,
        Height: 0,
        NormalPicUrl: '',
        ShinyPicUrl: '',
        Stats: null,
        Cries: null,
        Abilities: null
    })
    const HandleNext = async () => setIndex(
        index+1 >= MAX_POKEMON ? index + 1 == MAX_POKEMON+1 ? 1 : index + 1 : index + 1
    )
    const HandlePrevious = async () => setIndex(
        index-1 <= 0 ? MAX_POKEMON : index - 1    
    )
    const handleSearch = async () => {
        if (!isNaN(Number(pokemonText))) {
            setSearchIndex(Number(pokemonText))
            setPokemonText('')
            setIndex(Number(pokemonText))
            return
        }

        try {
            const response = await fetch(`${baseUrl}pokemon/${pokemonText}`)
            const data = await response.json()
            console.log(data)
            setIndex(data.id)
        } catch (error) {
            console.error(error)
            setStats(EMPTY_STATS)
        }

    }
    const FetchPokemon = async (in_index:number=0) => {
        try {
            const response = await fetch(`${baseUrl}pokemon/${in_index}`)
            const data = await response.json()
            console.log(data)
            setStats({
                Available: true,
                Name: data.name,
                Index: data.id,
                Type: data.types[0].type.name,
                Weight: data.weight,
                Height: data.height,
                NormalPicUrl: data.sprites.front_default,
                ShinyPicUrl: data.sprites.front_shiny,
                Stats: [...data.stats],
                Cries: {
                    latest: data.cries.latest,
                    legacy: data.cries.legacy
                },
                Abilities: [...data.abilities]
            })
        } catch (error) {
            console.error(error)
            setStats(EMPTY_STATS)
        }
    }
    useEffect(() => {
        const async_wrapper = async () => {
            FetchPokemon(index)
        }; async_wrapper();
    }, [index])
    useEffect(() => {const async_wrapper = async () => {FetchPokemon(index)}; async_wrapper()},[]);
    return (
        <div>
            <h1>Pokemon index searcher</h1>
            <input 
                type='text'
                value={pokemonText}
                onChange={(e) => {
                    const val = e.target.value
                    setPokemonText(val)
                }}
                placeholder='Enter pokemon name or index id'
            />
            <Button text="Search" onClick={handleSearch} />
            <div className='MID_DIV'>
                <Button text="Previous" onClick={HandlePrevious} />
                <PokemonStat props={stats} />
                <Button text="Next" onClick={HandleNext} />
            </div>
        </div>
    )
}

export default App
