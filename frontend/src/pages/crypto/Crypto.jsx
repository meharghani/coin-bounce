import { useState, useEffect } from "react";
import Loader from "../../components/loader/Loader";
import { getCrypto } from "../../api/external";
import styles from "./Crypto.module.css";

function Crypto() {
    const [data, setData] = useState([]);

    useEffect(() => {
        //IIFE immediately invoked function expression
        (async function cryptoApiCall() {
            const responce = await getCrypto();
            setData(responce);
        })();
        //cleanup
        setData([]);
    }, []);
    if (data.length == 0) {
        return <Loader text="Cryptocurrencies" />;
    }
    const nagativeStyle = {
        color: "#ea3943",
    };
    const positiveStyle = {
        color: "#16c784",
    };
    return (
        <table className={styles.table}>
            <thead>
                <tr className={styles.head}>
                    <th>#</th>
                    <th>Coin</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>24h</th>
                </tr>
            </thead>
            <tbody>
                {data.map((coin) => (
                    <tr id={coin.id} className={styles.tableRow}>
                        <td>{coin.market_cap_rank}</td>

                        <td>
                            <div className={styles.logo}>
                                <img src={coin.image} width={30} height={30} alt="" />
                                {coin.name}
                            </div>
                        </td>
                        <td>
                            <div className={styles.symbol}>{coin.symbol}</div>
                        </td>
                        <td>{coin.current_price}$</td>
                        <td
                            style={
                                coin.price_change_percentage_24h < 0
                                    ? nagativeStyle
                                    : positiveStyle
                            }
                        >
                            {coin.price_change_percentage_24h}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Crypto;
