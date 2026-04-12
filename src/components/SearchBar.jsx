import { useState, useEffect, useRef } from 'react'
import { searchCities } from '../services/weather'
import styles from './SearchBar.module.css'

export default function SearchBar({ onSearch, onGeolocate, loading }) {
  const [value, setValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)
  const wrapRef = useRef(null)

  // Debounce: espera 350ms después de que el usuario deja de escribir
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      const results = await searchCities(value)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setActiveSuggestion(-1)
      setSearching(false)
    }, 350)

    return () => clearTimeout(debounceRef.current)
  }, [value])

  // Cierra sugerencias al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(city) {
    setValue(city.label)
    setSuggestions([])
    setShowSuggestions(false)
    onSearch(city.name, city.lat, city.lon)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      handleSelect(suggestions[activeSuggestion])
    } else if (value.trim()) {
      setShowSuggestions(false)
      onSearch(value.trim())
    }
  }

  function handleKeyDown(e) {
    if (!showSuggestions) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapRef}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <span className={styles.icon}>
            {searching ? (
              <span className={styles.miniSpinner} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            )}
          </span>
          <input
            className={styles.input}
            type="text"
            placeholder="Buscar ciudad..."
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            disabled={loading}
            autoComplete="off"
          />
          <button className={styles.searchBtn} type="submit" disabled={loading || !value.trim()}>
            Buscar
          </button>
        </div>
        <button
          className={styles.geoBtn}
          type="button"
          onClick={onGeolocate}
          disabled={loading}
          title="Usar mi ubicación"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            <circle cx="12" cy="12" r="7" strokeDasharray="2 2"/>
          </svg>
        </button>
      </form>

      {showSuggestions && (
        <ul className={styles.suggestions}>
          {suggestions.map((city, i) => (
            <li
              key={`${city.lat}-${city.lon}`}
              className={`${styles.suggestion} ${i === activeSuggestion ? styles.active : ''}`}
              onMouseDown={() => handleSelect(city)}
              onMouseEnter={() => setActiveSuggestion(i)}
            >
              <span className={styles.suggestionName}>{city.name}</span>
              <span className={styles.suggestionMeta}>
                {[city.state, city.country].filter(Boolean).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
