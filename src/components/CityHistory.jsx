import styles from './CityHistory.module.css'

export default function CityHistory({ history, onSelect }) {
  if (!history || history.length === 0) return null

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Recientes</span>
      <div className={styles.pills}>
        {history.map((city, i) => (
          <button
            key={`${city.name}-${i}`}
            className={styles.pill}
            onClick={() => onSelect(city.name, city.lat, city.lon)}
          >
            <span className={styles.pillName}>{city.name}</span>
            <span className={styles.pillCountry}>{city.country}</span>
          </button>
        ))}
      </div>
    </div>
  )
}