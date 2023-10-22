import styles from './Loader.module.css'
import { Triangle } from 'react-loader-spinner'
function Loader({ text }) {
    return (
        <div className={styles.loaderWrapper}>
            <h2>Loading {text}</h2>
            <Triangle height={80} width={80} radius={1} color={'#3861fb'} />
        </div>
    )
}

export default Loader