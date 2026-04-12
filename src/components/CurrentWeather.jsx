import { useState, useEffect } from 'react'
import { iconUrl } from '../services/weather'
import styles from './CurrentWeather.module.css'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function getLocalTime(timezoneOffset) {
  // timezoneOffset de la API viene en segundos
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000
  const local = new Date(utc + timezoneOffset * 1000)
  const h = local.getHours().toString().padStart(2, '0')
  const m = local.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

export default function CurrentWeather({ data }) {
  const [localTime, setLocalTime] = useState(getLocalTime(data.timezone))

  // Actualiza el reloj cada minuto
  useEffect(() => {
    setLocalTime(getLocalTime(data.timezone))
    const interval = setInterval(() => {
      setLocalTime(getLocalTime(data.timezone))
    }, 60000)
    return () => clearInterval(interval)
  }, [data.timezone])

  const now = new Date()
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.location}>
          <h1 className={styles.city}>{data.name}</h1>
          <span className={styles.country}>{data.sys.country}</span>
          <p className={styles.date}>{dateStr}</p>
        </div>
        <div className={styles.rightTop}>
          <div className={styles.localTime}>{localTime}</div>
          <div className={styles.localTimeLabel}>hora local</div>
          <img
            className={styles.icon}
            src={iconUrl(data.weather[0].icon)}
            alt={data.weather[0].description}
          />
        </div>
      </div>

      <div className={styles.tempRow}>
        <span className={styles.temp}>{Math.round(data.main.temp)}</span>
        <span className={styles.unit}>°C</span>
      </div>

      <p className={styles.description}>{data.weather[0].description}</p>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Sensación</span>
          <span className={styles.detailValue}>{Math.round(data.main.feels_like)}°</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Humedad</span>
          <span className={styles.detailValue}>{data.main.humidity}%</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Viento</span>
          <span className={styles.detailValue}>{Math.round(data.wind.speed)} km/h</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailLabel}>Visibilidad</span>
          <span className={styles.detailValue}>{(data.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
    </div>
  )
}