import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import styles from './styles/App.module.css';

const BASE_URL_GAMES="https://www.cheapshark.com/api/1.0/games";
const BASE_URL_STORES="https://www.cheapshark.com/api/1.0/stores";

interface Game {
    gameID: string;
    steamAppID: string;
    cheapest: string;
    cheapestDealID: string;
    external: string;
    internalName: string;
    thumb: string;
}

interface Info {
    title: string;
    steamAppID: string;
    thumb: string;
}
interface CheapestPriceEver {
    price: string;
    date: number;
}
interface Deal {
    storeID: string;
    dealID: string;
    price: string;
    retailPrice: string;
    savings: string;
}
interface GameDetails {
    info: Info;
    cheapestPriceEver: CheapestPriceEver;
    deals: Deal[];
}

interface Store {
    storeID: string;
    storeName: string;
    isActive: number;
    images: {
        banner: string;
        logo: string;
        icon: string;
    };
}

const GameCard = ({ game, handleClick }: { game: Game; handleClick: (gameId: string) => void }) => {
    return (
        <div className={styles.GameCard} onClick={() => handleClick(game.gameID)}>
            <img src={game.thumb} alt={game.internalName} />
            <h2>{game.internalName}</h2>
        </div>
    );
};


const GameDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [storeDetails, setStoreDetails] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>('');

    useEffect(() => {
        const fetchGameDetails = async () => {
            setLoading(true);
            setLoadingText('Loading game details...');
            try {
                const gameResponse = await fetch(`${BASE_URL_GAMES}?id=${id}`);
                const gameData = await gameResponse.json();
                setGameDetails(gameData);

                const storeResponse = await fetch(`${BASE_URL_STORES}`);
                const storeData = await storeResponse.json();
                setStoreDetails(storeData);
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }

        };
        
        fetchGameDetails();
    }, [id]);
    
    if (loading) {
        return (
            <div className={styles.loading}>
                <p>{loadingText}</p>
            </div>
        );
    }
    console.log('Game details:', gameDetails);
    console.log('Store details:', storeDetails);

    return (
        <div className={styles.GameDetails}>
            <button
                className={styles.backButton}
                onClick={() => navigate('/')}
            >
                Back to search
            </button>
            {gameDetails && (
                <>
                    <h1>{gameDetails.info.title}</h1>
                    <img
                        src={gameDetails.info.thumb}
                        alt={gameDetails.info.title}
                        className={styles.gameImage}
                    />
                    <h2>Lowest Price Ever: ${gameDetails.cheapestPriceEver.price}</h2>
                    <h3>Current Offers</h3>
                    <div className={styles.deals}>
                        {gameDetails.deals.map((deal) => {
                            const store = storeDetails.find(store => store.storeID === deal.storeID);
                            return (
                                <div key={deal.dealID} className={styles.dealCard}>
                                    <h4>{store?.storeName}</h4>
                                    <img
                                        src={`https://www.cheapshark.com/${store?.images.logo}`}
                                        alt={store?.storeName}
                                        className={styles.storeLogo}
                                    />
                                    <p>Price: ${deal.price}</p>
                                    <p>Retail Price: ${deal.retailPrice}</p>
                                    <p>Savings: {deal.savings}%</p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

function App() {
    const [gameName, setGameName] = useState<string>('');


    const [loading, setLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>('');

    const [gameData, setGameData] = useState<Game[]>([]);

    const navigate = useNavigate();

    const searchGames = async () => {
        setLoading(true);
        setLoadingText('Searching for games...');
        try {
            const response = await fetch(`${BASE_URL_GAMES}?title=${gameName}`);
            const data = await response.json();
            setGameData(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    if(loading) {
        return (
            <div>
                <p>{loadingText}</p>
            </div>
        );
    }

    const handleClick = (gameId: string) => {
        navigate(`/game/${gameId}`);
    }
    
    return (
        <div>

            <form>
                <input
                    className={styles.input}
                    onChange={(e) => setGameName(e.target.value)}
                    value={gameName}
                    type="text"
                    placeholder="Enter game name"
                />
                <input 
                    className={styles.button} 
                    type="submit"
                    onClick={(e) => {e.preventDefault(); searchGames();}}
                    value="Search" 
                />
            </form>

            {
                gameData.map((game: Game) => (
                    <GameCard key={game.gameID} game={game} handleClick={handleClick}/>
                ))
            }
        </div>
    );
}

function AppWrap() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/game/:id" element={<GameDetails />} />
            </Routes>
        </Router>
    );
}

export default AppWrap;
