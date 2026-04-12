import { groupForecastByDay, iconUrl } from '../services/weather'
import styles from './Forecast.module.css'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function Forecast({ data }) {
  const days = groupForecastByDay(data.list)

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Próximos 5 días</p>
      <div className={styles.grid}>
        {days.map((item, i) => {
          const date = new Date(item.dt * 1000)
          const dayName = i === 0 ? 'Hoy' : DAYS[date.getDay()]
          return (
            <div className={styles.card} key={item.dt} style={{ animationDelay: `${i * 60}ms` }}>
              <span className={styles.day}>{dayName}</span>
              <img
                className={styles.icon}
                src={iconUrl(item.weather[0].icon)}
                alt={item.weather[0].description}
              />
              <span className={styles.temp}>{Math.round(item.main.temp)}°</span>
              <span className={styles.desc}>{item.weather[0].description}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
