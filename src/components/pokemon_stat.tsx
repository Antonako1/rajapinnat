import { useEffect, useState } from "react";

export interface PokemonStats {
    Available: boolean;
     
    Name: string;
    Index: number;
    Type: string;
    Weight: number;
    Height: number;
    
    NormalPicUrl: string;
    ShinyPicUrl: string;
    Stats : Stat[] | null;
    Cries : Cry | null;
    Abilities : Ability[] | null;
}
export interface Cry {
    latest: string;
    legacy: string;
}
export interface Stat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    }
}
export interface Ability {
    ability: {
        name: string;
        url: string;
    }
    is_hidden: boolean;
    slot: number;
}

interface Ability_Fetch{
    ShowAbility: boolean;
    name: string;
    effect_entries : [{
        effect: string;
        language: {
            name: string; //lang tag
            url: string;
        },
        short_effect: string;
    }],
    pokemon: [{
        is_hidden: boolean;
        pokemon: {
            name: string;
            url: string;
        },
        slot: number;
    }]
}

interface PokemonStatProps {
    props: PokemonStats;
}
const PokemonStat = ({props} : PokemonStatProps) => {
    if(!props.Available) {
        return (
            <h1>Pokemon not found</h1>
        )
    }
    const [colour, setColour] = useState<string>('white');
    const [show_stats, setShowStats] = useState<boolean>(false);
    const [showabilities, setShowAbilities] = useState<boolean>(false);
    const [ability_fetch, setAbilityFetch] = useState<Ability_Fetch | null>(null);
    useEffect(() => {
        let BACKGROUND_COLOR = 'white';
        switch(props.Type) {
            case 'normal':
                BACKGROUND_COLOR = 'white';
                break;
            case 'fire':
                BACKGROUND_COLOR = 'red';
                break;
            case 'water':
                BACKGROUND_COLOR = 'blue';
                break;
            case 'grass':
                BACKGROUND_COLOR = 'green';
                break;
            case 'electric':
                BACKGROUND_COLOR = 'yellow';
                break;
            case 'ice':
                BACKGROUND_COLOR = 'lightblue';
                break;
            case 'magic':
                BACKGROUND_COLOR = 'purple';
                break;
            case "bug":
                BACKGROUND_COLOR = 'green';
                break;
            case "ground":
                BACKGROUND_COLOR = 'brown';
                break;
            case "rock":
                BACKGROUND_COLOR = 'grey';
                break;
            case "poison":
                BACKGROUND_COLOR = 'purple';
                break;
            case "flying":
                BACKGROUND_COLOR = 'skyblue';
                break;
            case "fairy":
                BACKGROUND_COLOR = 'pink';
                break;
            case "ghost":
                BACKGROUND_COLOR = 'purple';
                break;
            case "dragon":
                BACKGROUND_COLOR = 'purple';
                break;
            case "psychic":
                BACKGROUND_COLOR = 'pink';
                break;
            default:
                BACKGROUND_COLOR = 'white';
                break;
        }
        setColour(BACKGROUND_COLOR);
    },[props.Type]);

    const HANDLE_ABILITY = async (ability: Ability | null) => {
        if(ability === null) {
            setAbilityFetch(null);
            return;
        }
        try {
            if(ability.ability.name === ability_fetch?.name) {
                setAbilityFetch(null);
                return;
            }
            const response = await fetch(ability.ability.url);
            const data = await response.json();
            setAbilityFetch({
                ShowAbility: true,
                name: data.name,
                effect_entries: data.effect_entries,
                pokemon: data.pokemon
            });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div style={{backgroundColor: colour}} className="STATTS">
            <h1>{props.Name}</h1>
            <h2>Index: {props.Index}</h2>
            <h2>Type: {props.Type}</h2>
            <h2>Weight: {props.Weight}</h2>
            <h2>Height: {props.Height}</h2>
            <img src={props.NormalPicUrl} alt="Normal Pic" />
            <img src={props.ShinyPicUrl} alt="Shiny Pic" />

            <button onClick={() => {setShowStats(!show_stats)}}>{
                show_stats ? 'Hide stats' : 'Show stats'
            }</button>
            <button onClick={() => {setShowAbilities(!showabilities)}}>{
                showabilities ? 'Hide abilities' : 'Show abilities'
            }</button>

            <h2>Cries</h2>
            <span>Legacy cry</span>
            <audio src={props.Cries?.legacy} controls>Legacy cry</audio>
            <hr/>
            <span>Latest cry</span>
            <audio src={props.Cries?.latest} controls>Latest cry</audio>

            <div className="ABILITIES">
                {
                    showabilities && props.Abilities?.map((ability, index) => {
                        return (
                            <div key={index}
                            >
                                <h3>{ability.ability.name}</h3>
                                <h4>Hidden: {ability.is_hidden ? 'Yes' : 'No'}</h4>
                                <h4>Slot: {ability.slot}</h4>
                                <button
                                onClick={() => {HANDLE_ABILITY(ability)}}
                                >Fetch ability information</button>
                                {
                                    <div>
                                        {
                                            ability_fetch !== null && ability_fetch.ShowAbility && 
                                            ability_fetch.name === ability.ability.name ? (
                                                <div>
                                                    <h3>{ability_fetch.name}</h3>
                                                    <br/>
                                                    <h4>Effect</h4>
                                                    {
                                                        ability_fetch.effect_entries.map((entry, index) => {
                                                            if(entry.language.name === 'en') {
                                                                return (
                                                                    <p key={index}>{entry.effect}</p>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    <br/>
                                                    <h4>Short effect</h4>
                                                    {
                                                        ability_fetch.effect_entries.map((entry, index) => {
                                                            if(entry.language.name === 'en') {
                                                                return (
                                                                    <p key={index}>{entry.short_effect}</p>
                                                                )
                                                            }
                                                        })
                                                    }
                                                    <br/>
                                                    <h4>Pokemons that have same ability</h4>
                                                    {
                                                        ability_fetch.pokemon.map((pokemon, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <h5>{pokemon.pokemon.name}</h5>
                                                                    <h6>Hidden: {pokemon.is_hidden ? 'Yes' : 'No'}</h6>
                                                                    <h6>Slot: {pokemon.slot}</h6>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3>Ability not fetched</h3>
                                                </div>
                                            )
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>

            <div className="StatPanel">
                {
                    show_stats && props.Stats?.map((stat, index) => {
                        return (
                            <div key={index}>
                                <h3>{stat.stat.name}</h3>
                                <h4>Base stat: {stat.base_stat}</h4>
                                <h4>Effort: {stat.effort}</h4>
                                
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PokemonStat;