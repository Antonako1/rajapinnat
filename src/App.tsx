import { Route, Routes, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styles from './styles/App.module.css'
import React, { useEffect, useState } from 'react'

const TIMEOUT = 2500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ImageUrls {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  }
  
  interface Trailer {
    youtube_id: string;
    url: string;
    embed_url: string;
  }
  
  interface Title {
    type: string;
    title: string;
  }
  
  interface AiredDate {
    day: number;
    month: number;
    year: number;
  }
  
  interface Aired {
    from: AiredDate;
    to: AiredDate;
    string: string;
  }
  
  interface Broadcast {
    day: string;
    time: string;
    timezone: string;
    string: string;
  }
  
  interface Producer {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }
  
  interface Genre {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }
  
  interface RelationEntry {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }
  
  interface Relation {
    relation: string;
    entry: RelationEntry[];
  }
  
  interface Theme {
    openings: string[];
    endings: string[];
  }
  
  interface External {
    name: string;
    url: string;
  }
  
  interface Streaming {
    name: string;
    url: string;
  }
  
  interface AnimeData {
    mal_id: number;
    url: string;
    images: {
      jpg: ImageUrls;
      webp: ImageUrls;
    };
    trailer: Trailer;
    approved: boolean;
    titles: Title[];
    title: string;
    title_english: string;
    title_japanese: string;
    title_synonyms: string[];
    type: string;
    source: string;
    episodes: number;
    status: string;
    airing: boolean;
    aired: Aired;
    duration: string;
    rating: string;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    season: string;
    year: number;
    broadcast: Broadcast;
    producers: Producer[];
    licensors: Producer[];
    studios: Producer[];
    genres: Genre[];
    explicit_genres: Genre[];
    themes: Genre[];
    demographics: Genre[];
    relations: Relation[];
    theme: Theme;
    external: External[];
    streaming: Streaming[];
}


interface RecommendationData {
    entry: {
        mal_id: number;
        url: string;
        images: {
            image_url: string;
        },
        title: string;
    };
    url: string;
    votes: number;
}
const AnimeCardMain: React.FC<{ 
    anime: AnimeData,
    handleClick: (id: number) => void
 }> = ({ anime, handleClick }) => {
    if(!anime) return <div></div>
    return (
      <div 
      className={styles.animeCard}
        onClick={() => handleClick(anime.mal_id)}
      >
        <img src={anime.images.jpg.large_image_url} alt={anime.title} />
        <h2>{anime.title_english}</h2>
        <h2>{anime.title_japanese}</h2>
        <p>{anime.synopsis}</p>
      </div>
    );
  }

const AnimeCardSmall: React.FC<{ 
    anime: AnimeData,
    handleClick?: (id: number) => void
 }> = ({ anime, handleClick }) => {
    if(!anime) return <div>None</div>
    return (
      <div 
      className={styles.animeCardSmall}
      onClick={() => handleClick ? handleClick(anime.mal_id) : console.log(anime.mal_id)}
      >
        <img src={anime.images.jpg.image_url} alt={anime.title} />
        <h3>{anime.title_english}</h3>
        <h3>{anime.title_japanese}</h3>
      </div>
    );
  }



const AnimeDetails: React.FC = () => {
    const { malId } = useParams<{ malId: string }>();
    const [anime, setAnime] = useState<AnimeData | null>(null);
    const [fourRecommendations, setFourRecommendations] = useState<AnimeData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const FetchAnime = async () => {
            setFourRecommendations([]);
            setAnime(null);

            try {
                const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/full`);
                const data = await res.json();
                setAnime(data.data);

                const recommendationsRes = await fetch(`https://api.jikan.moe/v4/anime/${malId}/recommendations`);
                const recommendationsData:RecommendationData[] = (await recommendationsRes.json()).data;
                let temp: AnimeData[] = [];
                for (let i = 0; i < Math.min(4, recommendationsData.length); i++) {
                    const animeId = recommendationsData[i].entry.mal_id;
                    const detailsRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
                    const detailsData = await detailsRes.json();
                    temp.push(detailsData.data);
                    sleep(TIMEOUT);
                }
                setFourRecommendations(temp);
            } catch (error) {
                console.error("Error fetching anime:", error);
            }
        }
        FetchAnime();
    }, [malId]);

    return (
        <div className={styles.DetailsMain}>
            <button
            onClick={() => {
                navigate("/");
            }}
            >Back to home</button>
            <h1>Details</h1>
            {anime && (
                <>
                <div>
                    <h2>{anime.title_english}</h2>
                    <h2>{anime.title_japanese}</h2>
                    <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                    <p>{anime.synopsis}</p>
                    <p>Type: {anime.type}</p>
                    <p>Episodes: {anime.episodes}</p>
                    <p>Status: {anime.status}</p>
                    <p>Aired: {anime.aired.string}</p>
                    <p>Rating: {anime.rating}</p>
                    <p>Score: {anime.score}</p>
                </div>
                <h2>Recommendations:</h2>
                <div className={styles.recommendations}>
                {
                        fourRecommendations && 
                        fourRecommendations.map((anime:AnimeData) => (
                                <>
                                    {
                                        anime ?
                                        <AnimeCardSmall 
                                            key={anime.mal_id} 
                                            anime={anime} 
                                            handleClick={() => {
                                                navigate(`/anime/${anime.mal_id}`);
                                            }}
                                        />
                                        : <></>
                                        
                                    }
                                </>
                        ))
                    }
                </div>
                </>
            )}
        </div>
    );
};


const Home = () => {
    const [searchedAnimes, setSearchedAnimes] = useState<AnimeData[]>([]);
    const [inputData, setInputData] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string>(""); // Anime type filter
    const [statusFilter, setStatusFilter] = useState<string>(""); // Status filter
    const [ratingFilter, setRatingFilter] = useState<string>(""); // Rating filter
    const [minScore, setMinScore] = useState<string>(""); // Minimum score
    const [maxScore, setMaxScore] = useState<string>(""); // Maximum score
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>("Loading...");

    const [LoadRecommendations, setLoadRecommendations] = useState<boolean>(false);

    const [eightAnimes, setEightAnimes] = useState<AnimeData[]>([]);

    useEffect(() => {
        setSearchedAnimes([]);
        setInputData("");
        setTypeFilter("");
        setStatusFilter("");
        setRatingFilter("");
        setMinScore("");
        setMaxScore("");


    }, []);
    const _FetchAnimes = async () => {
        setEightAnimes([]);
        try {
            // eight random animes
            let temp: AnimeData[] = [];
            for (let i = 0; i < 8; i++) {
                const res = await fetch(`https://api.jikan.moe/v4/random/anime`);
                const data = await res.json();
                for(let j = 0; j < temp.length; j++) {
                    if(temp[j].mal_id === data.data.mal_id) {
                        i--;
                        continue;
                    }
                }
                temp.push(data.data);
                sleep(TIMEOUT);
            }
            setEightAnimes(temp);
        } catch (error) {
            console.error("Error fetching animes:", error);
        }
    }
    const navigate = useNavigate();

    const FetchAnimes = async () => {
        setLoading(true);
        setLoadingText("Looking up that anime...");
        setSearchedAnimes([]);
        
        let temp: AnimeData[] = [];
        try {
            const params = new URLSearchParams();
            if (inputData) params.append("q", inputData);
            if (typeFilter) params.append("type", typeFilter);
            if (statusFilter) params.append("status", statusFilter);
            if (ratingFilter) params.append("rating", ratingFilter);
            if (minScore) params.append("min_score", minScore);
            if (maxScore) params.append("max_score", maxScore);
            params.append("limit", "6");
            const res = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);
            const data = await res.json();
            for (let i = 0; i < Math.min(6, data.data.length); i++) {
                const animeId = data.data[i].mal_id;
                const detailsRes = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
                const detailsData = await detailsRes.json();
                temp.push(detailsData.data);
                sleep(TIMEOUT);
            }
            setSearchedAnimes(temp);
        } catch (error) {
            console.error("Error fetching animes:", error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToRandomAnime = async () => {

        try {
            const res = await fetch(`https://api.jikan.moe/v4/random/anime`);
            const data = await res.json();
            navigate(`/anime/${data.data.mal_id}`);
        } catch (error) {
            console.error("Error fetching animes:", error);
        }
    }

    const navigateToAnime = (id: number) => {
        navigate(`/anime/${id}`);
    }

    if (loading) {
        return (
            <div className={styles["spinner-container"]}>
                <div className={styles["spinner"]}></div>
                <h2>Loading...</h2>
            </div>
        );
    }

  return (
    <div className={styles.Home}>
      <h1>Search for Anime</h1>
      {/* Search Input */}
      <input
        placeholder={"Anime's name"}
        onChange={(e) => setInputData(e.target.value)}
        id="animeName"
      />

      {/* Type Filter */}
      <select onChange={(e) => setTypeFilter(e.target.value)} value={typeFilter}>
        <option value="">Type</option>
        <option value="tv">TV</option>
        <option value="movie">Movie</option>
        <option value="ova">OVA</option>
        <option value="special">Special</option>
        <option value="ona">ONA</option>
        <option value="music">Music</option>
        <option value="cm">CM</option>
        <option value="pv">PV</option>
        <option value="tv_special">TV Special</option>
      </select>

      {/* Status Filter */}
      <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
        <option value="">Status</option>
        <option value="airing">Airing</option>
        <option value="complete">Complete</option>
        <option value="upcoming">Upcoming</option>
      </select>

      {/* Rating Filter */}
      <select onChange={(e) => setRatingFilter(e.target.value)} value={ratingFilter}>
        <option value="">Rating</option>
        <option value="g">G - All Ages</option>
        <option value="pg">PG - Children</option>
        <option value="pg13">PG-13 - Teens 13 or older</option>
        <option value="r17">R - 17+ (violence & profanity)</option>
        <option value="r">R+ - Mild Nudity</option>
        <option value="rx">Rx - Hentai</option>
      </select>

      {/* Min and Max Score */}
      <input
        type="number"
        placeholder="Min Score, min: 0"
        value={minScore}
        onChange={(e) => setMinScore(e.target.value)}
        min="0"
        max="10"
        step="0.1"
      />
      <input
        type="number"
        placeholder="Max Score, max: 10"
        value={maxScore}
        onChange={(e) => setMaxScore(e.target.value)}
        min="0"
        max="10"
        step="0.1"
      />

      <button
        onClick={() => {
            setInputData("");
            setTypeFilter("");
            setStatusFilter("");
            setRatingFilter("");
            setMinScore("");
            setMaxScore("");
            setSearchedAnimes([]);
        }}
      >Clear search parameters</button>
      <button onClick={FetchAnimes}>Search</button>

      <button
      onClick={navigateToRandomAnime}
      >
        See random anime
      </button>

      

      {/* Search Results */}
      <h2>Search Results</h2>
      <div className={styles.animeCards}>
        {searchedAnimes && searchedAnimes.map((anime, index) => (
          index === 0 ? (
                {
                    ...anime &&
                    <AnimeCardMain 
                        key={anime.mal_id} 
                        anime={anime}
                        handleClick={(id:number) => {
                            navigateToAnime(id);
                        }} 
                        />
                }
            ) : (
                {
                    ...anime &&
                    <AnimeCardSmall 
                        key={anime.mal_id} 
                        anime={anime} 
                        handleClick={(id:number) => {
                            navigateToAnime(id);
                        }}
                    />
                }
          )
        ))}


        
      </div>


      <h2>Eight random animes</h2>
      <button onClick={_FetchAnimes}>Get eight recommendations</button>
      {
        <div className={styles.randomMain}>
            {
        eightAnimes && 
        eightAnimes.map((anime:AnimeData) => (
                <div className={styles.randoms}>
                    {
                        anime ?
                        <AnimeCardSmall 
                            key={anime.mal_id} 
                            anime={anime} 
                            handleClick={() => {
                                navigate(`/anime/${anime.mal_id}`);
                            }}
                        />
                        : <></>
                        
                    }
                </div>
        ))}
        </div>
      }
    </div>
  );
};


  
function App() {
    return (
        <Routes>
            <Route path="/anime/:malId" element={<AnimeDetails />}/>
            <Route path="/" element={<Home />}/>
        </Routes>
    )
}

    export default App
