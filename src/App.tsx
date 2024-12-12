import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BASE_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range";

const App = () => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [prices, setPrices] = useState<number[][]>([]);
    const [volumes, setVolumes] = useState<number[][]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<{
        bearishTrend: number;
        highestVolume: { date: string; volume: number } | null;
        bestBuySell: { buyDate: string; sellDate: string } | null;
    } | null>(null);

    const fetchData = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates!");
            return;
        }

        const from = new Date(startDate).getTime() / 1000;
        const to = new Date(endDate).getTime() / 1000 + 3600;

        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}?vs_currency=eur&from=${from}&to=${to}`);
            const { prices, total_volumes } = response.data;
            setPrices(prices);
            setVolumes(total_volumes);

            analyzeData(prices, total_volumes);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const analyzeData = (prices: number[][], volumes: number[][]) => {
        const dates = prices.map(([timestamp]) => new Date(timestamp).toISOString().split("T")[0]);
        const priceValues = prices.map(([_, price]) => price);
        const volumeValues = volumes.map(([_, volume]) => volume);

        let maxBearish = 0, currentBearish = 0;
        for (let i = 1; i < priceValues.length; i++) {
            if (priceValues[i] < priceValues[i - 1]) {
                currentBearish++;
                maxBearish = Math.max(maxBearish, currentBearish);
            } else {
                currentBearish = 0;
            }
        }

        const highestVolumeIndex = volumeValues.indexOf(Math.max(...volumeValues));
        const highestVolume = {
            date: dates[highestVolumeIndex],
            volume: volumeValues[highestVolumeIndex],
        };

        let minPriceIndex = 0;
        let maxProfit = 0;
        let bestBuyIndex = -1;
        let bestSellIndex = -1;
        for (let i = 1; i < priceValues.length; i++) {
            const profit = priceValues[i] - priceValues[minPriceIndex];
            if (profit > maxProfit) {
                maxProfit = profit;
                bestBuyIndex = minPriceIndex;
                bestSellIndex = i;
            }
            if (priceValues[i] < priceValues[minPriceIndex]) {
                minPriceIndex = i;
            }
        }
        const bestBuySell = maxProfit > 0 ? {
            buyDate: dates[bestBuyIndex],
            sellDate: dates[bestSellIndex],
        } : null;

        setResults({ bearishTrend: maxBearish, highestVolume, bestBuySell });
    };

    const chartData = {
        labels: prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString()),
        datasets: [
            {
                label: "Bitcoin Price (€)",
                data: prices.map(([_, price]) => price),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: "Bitcoin Price Chart" },
        },
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Bitcoin Analysis</h1>
            <div>
                <label>
                    Start Date:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </label>
                <button onClick={fetchData} disabled={loading}>
                    {loading ? "Loading..." : "Analyze"}
                </button>
            </div>

            {prices.length > 0 && <Line data={chartData} options={chartOptions} />}

            {results && (
                <div>
                    <h2>Results</h2>
                    <p>Longest Bearish Trend: {results.bearishTrend} days</p>
                    <p>
                        
                        Highest Volume: {results.highestVolume?.volume.toFixed(2)}€ on {results.highestVolume?.date}
                    </p>
                    {results.bestBuySell ? (
                        <p>
                            Best Buy Date: {results.bestBuySell.buyDate}, Best Sell Date: {results.bestBuySell.sellDate}
                        </p>
                    ) : (
                        <p>Bitcoin price only decreased during the range.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
