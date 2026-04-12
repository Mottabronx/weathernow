# WeatherNow 🌤

App de clima en tiempo real construida con React + Vite y la API de OpenWeatherMap.

## Funcionalidades

- Búsqueda de clima por ciudad
- Geolocalización automática
- Clima actual con temperatura, humedad, viento y visibilidad
- Pronóstico de los próximos 5 días
- Diseño responsive

## Stack

- React 18
- Vite 5
- CSS Modules
- OpenWeatherMap API

## Cómo correr el proyecto

### 1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/weathernow.git
cd weathernow
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura tu API key

- Regístrate gratis en [openweathermap.org](https://openweathermap.org/api)
- Ve a "My API Keys" y copia tu key
- Copia el archivo de ejemplo:
```bash
cp .env.example .env
```
- Abre `.env` y pega tu API key:
```
VITE_WEATHER_API_KEY=tu_api_key_aqui
```

### 4. Corre el proyecto
```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## Deploy en Vercel

1. Sube el proyecto a GitHub
2. Entra a [vercel.com](https://vercel.com) y conecta tu repositorio
3. En "Environment Variables" agrega `VITE_WEATHER_API_KEY` con tu key
4. Deploy automático ✅
