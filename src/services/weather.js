const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const BASE = 'https://api.openweathermap.org/data/2.5'
const GEO = 'https://api.openweathermap.org/geo/1.0'

const params = (extra = {}) =>
  new URLSearchParams({ appid: API_KEY, units: 'metric', lang: 'es', ...extra })

export async function searchCities(query) {
  if (!query || query.length < 2) return []
  const res = await fetch(`${GEO}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.map(city => ({
    name: city.name,
    country: city.country,
    state: city.state || '',
    lat: city.lat,
    lon: city.lon,
    label: [city.name, city.state, city.country].filter(Boolean).join(', '),
  }))
}

export async function getWeatherByCity(city) {
  const res = await fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&${params()}`)
  if (!res.ok) throw new Error('Ciudad no encontrada')
  return res.json()
}

export async function getForecastByCity(city) {
  const res = await fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&${params()}`)
  if (!res.ok) throw new Error('Error al obtener pronóstico')
  return res.json()
}

export async function getWeatherByCoords(lat, lon) {
  const res = await fetch(`${BASE}/weather?${params({ lat, lon })}`)
  if (!res.ok) throw new Error('Error con geolocalización')
  return res.json()
}

export async function getForecastByCoords(lat, lon) {
  const res = await fetch(`${BASE}/forecast?${params({ lat, lon })}`)
  if (!res.ok) throw new Error('Error al obtener pronóstico')
  return res.json()
}

export function groupForecastByDay(list) {
  const days = {}
  list.forEach(item => {
    const date = item.dt_txt.split(' ')[0]
    const hour = item.dt_txt.split(' ')[1]
    if (!days[date] || hour === '12:00:00') {
      days[date] = item
    }
  })
  return Object.values(days).slice(0, 5)
}

export function iconUrl(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`
}
