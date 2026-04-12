import { useState, useEffect } from 'react'
import {
  getWeatherByCity,
  getForecastByCity,
  getWeatherByCoords,
  getForecastByCoords,
} from './services/weather'
import SearchBar from './components/SearchBar'
import CityHistory from './components/CityHistory'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import TemperatureChart from './components/TemperatureChart'
import styles from './App.module.css'

const HISTORY_KEY = 'weathernow_history'
const MAX_HISTORY = 5

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] }
  catch { return [] }
}

function saveHistory(name, lat, lon, country) {
  const prev = loadHistory().filter(c => c.name !== name)
  const next = [{ name, lat, lon, country }, ...prev].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

export default function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const [theme, setTheme] = useState('theme-clear-day')

  async function fetchByCity(city, lat, lon) {
    setLoading(true)
    setError(null)
    try {
      const [w, f] = lat && lon
        ? await Promise.all([getWeatherByCoords(lat, lon), getForecastByCoords(lat, lon)])
        : await Promise.all([getWeatherByCity(city), getForecastByCity(city)])

      setWeather(w)
      setForecast(f)

      // Guardamos con los datos reales que devuelve la API
      const updated = saveHistory(w.name, w.coord.lat, w.coord.lon, w.sys.country)
      setHistory(updated)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCity(null, pos.coords.latitude, pos.coords.longitude),
      () => setError('No se pudo obtener tu ubicación')
    )
  }

  useEffect(() => { fetchByCity('Santiago') }, [])

  // Aplica el tema como clase en el body
  useEffect(() => {
    const themes = ['theme-clear-day','theme-clear-night','theme-cloudy-day',
      'theme-cloudy-night','theme-rain','theme-thunder','theme-snow','theme-mist']
    document.body.classList.remove(...themes)
    document.body.classList.add(theme)
  }, [theme])

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.logo}>weather<span>now</span></span>
          <SearchBar onSearch={fetchByCity} onGeolocate={handleGeolocate} loading={loading} />
          <CityHistory history={history} onSelect={fetchByCity} />
        </header>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Cargando...</span>
          </div>
        )}

        {error && !loading && (
          <div className={styles.error}>
            <span>⚠</span> {error}
          </div>
        )}

        {!loading && weather && (
          <main className={styles.main}>
            <CurrentWeather data={weather} />
            {forecast && <TemperatureChart data={forecast} />}
            {forecast && <Forecast data={forecast} />}
          </main>
        )}
      </div>
    </div>
  )
}