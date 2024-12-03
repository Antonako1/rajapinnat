import styles from './styles/App.module.css'
import { useState } from 'react'

interface location_data {
    longitude: number;
    latitude: number;
}

function App() {
    const [getLocation, setLocation] = useState<location_data|null>(null);
    const [activelyFetching, setActivelyFetching] = useState<boolean>(false);

    const getLocationHandler =  async () => {
        setActivelyFetching(true);
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                longitude: position.coords.longitude,
                latitude: position.coords.latitude
            });
        });
    }

    return (
        <div>
            <button onClick={getLocationHandler}>Get location data</button>
            {getLocation ? (
                <div>
                    <h1>Location</h1>
                    <p>Longitude: {getLocation.longitude}</p>
                    <p>Latitude: {getLocation.latitude}</p>
                </div>
            ) : (
                activelyFetching ? (
                    <div>
                        <h1>Location</h1>
                        <p>Fetching location data...</p>
                    </div>
                ) : (
                    <div>
                        <h1>Location</h1>
                        <p>Location not found</p>
                    </div>
                )   
            )}
        </div>
    )
}

export default App
