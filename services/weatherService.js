const axios = require('axios');

// Traductor de códigos WMO (Open-Meteo) a texto legible
function interpretarCodigoWMO(code) {
  const codigos = {
    0: "cielo despejado", 1: "mayormente despejado", 2: "parcialmente nublado", 3: "nublado",
    45: "niebla", 48: "niebla con escarcha",
    51: "llovizna ligera", 53: "llovizna moderada", 55: "llovizna densa",
    61: "lluvia ligera", 63: "lluvia moderada", 65: "lluvia intensa",
    71: "nevada ligera", 73: "nevada moderada", 75: "nevada intensa",
    80: "chubascos ligeros", 81: "chubascos moderados", 82: "chubascos violentos",
    95: "tormenta eléctrica", 96: "tormenta con granizo ligero", 99: "tormenta con granizo fuerte"
  };
  return codigos[code] || "condiciones variables";
}

async function getCuscoWeather() {
  // 1. Intentar primero con OpenWeather (tu API principal)
  try {
    const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: 'Cusco,PE', units: 'metric', appid: process.env.OPENWEATHER_API_KEY }
    });
    console.log('✅ Clima obtenido de OpenWeather');
    return {
      temp: Math.round(res.data.main.temp),
      description: res.data.weather[0].description,
      humidity: res.data.main.humidity,
      fuente: 'OpenWeather'
    };
  } catch (error) {
    console.warn('⚠️ OpenWeather falló, intentando con Open-Meteo...');
  }

  // 2. Respaldo: Open-Meteo (No requiere API Key)
  try {
    // Coordenadas de Cusco: -13.53, -71.96
    const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: -13.53,
        longitude: -71.96,
        current_weather: true,
        timezone: 'America/Lima'
      }
    });

    const current = res.data.current_weather;
    console.log('✅ Clima obtenido de Open-Meteo (respaldo)');
    return {
      temp: Math.round(current.temperature),
      description: interpretarCodigoWMO(current.weathercode),
      humidity: null, // Open-Meteo current_weather no incluye humedad por defecto
      fuente: 'Open-Meteo'
    };
  } catch (error) {
    console.error('❌ Ambas APIs de clima fallaron:', error.message);
    throw new Error('No se pudo obtener el clima');
  }
}

module.exports = { getCuscoWeather };
