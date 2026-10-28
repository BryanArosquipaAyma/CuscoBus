require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const { getCuscoWeather } = require('./services/weatherService');
const { getRoute } = require('./services/routeService');
const rutasCusco = require('./data/routes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- CLIMA ACTUAL ---
app.get('/api/weather', async (req, res) => {
  try { res.json(await getCuscoWeather()); } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- PRONÓSTICO MAÑANA ---
app.get('/api/weather/tomorrow', async (req, res) => {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: { latitude: -13.53, longitude: -71.96, daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max', timezone: 'America/Lima', forecast_days: 2 }
    });
    const daily = response.data.daily;
    res.json({ tempMax: Math.round(daily.temperature_2m_max[1]), tempMin: Math.round(daily.temperature_2m_min[1]), lluviaProb: daily.precipitation_probability_max[1] });
  } catch (error) { res.status(500).json({ error: 'No se pudo obtener el pronóstico' }); }
});

// --- API PAÍSES (NUEVO) ---
app.get('/api/paises', (req, res) => {
  res.json([
    { code: 'PE', nombre: 'Perú', bandera: '🇵🇪', ciudad: 'Cusco' },
    { code: 'AR', nombre: 'Argentina', bandera: '🇦🇷', ciudad: 'Buenos Aires' },
    { code: 'BO', nombre: 'Bolivia', bandera: '🇧🇴', ciudad: 'La Paz' },
    { code: 'BR', nombre: 'Brasil', bandera: '🇧🇷', ciudad: 'São Paulo' },
    { code: 'CL', nombre: 'Chile', bandera: '🇨🇱', ciudad: 'Santiago' },
    { code: 'CO', nombre: 'Colombia', bandera: '🇨🇴', ciudad: 'Bogotá' },
    { code: 'EC', nombre: 'Ecuador', bandera: '🇪🇨', ciudad: 'Quito' },
    { code: 'MX', nombre: 'México', bandera: '🇲🇽', ciudad: 'Ciudad de México' },
    { code: 'ES', nombre: 'España', bandera: '🇪🇸', ciudad: 'Madrid' },
    { code: 'US', nombre: 'Estados Unidos', bandera: '🇺🇸', ciudad: 'Nueva York' }
  ]);
});

// --- RESTO DE APIS ---
app.get('/api/rutas', (req, res) => res.json(rutasCusco));

app.get('/api/paradero/:id/tiempos', (req, res) => {
  const paraderoId = parseInt(req.params.id);
  const rutasQuePasan = rutasCusco.filter(r => r.paraderos.some(p => p.id === paraderoId));
  if (rutasQuePasan.length === 0) return res.json([]);
  const resultados = rutasQuePasan.map(ruta => {
    let minutos = Math.floor(Math.random() * 12) + 2;
    const hora = new Date().getHours();
    if ((hora >= 7 && hora <= 9) || (hora >= 17 && hora <= 19)) minutos += 5;
    return { rutaId: ruta.id, nombreRuta: ruta.nombre, color: ruta.color, minutos };
  });
  resultados.sort((a, b) => a.minutos - b.minutos);
  res.json(resultados);
});

app.post('/api/route', async (req, res) => {
  try { res.json(await getRoute(req.body.origin, req.body.destination)); } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/stops', (req, res) => {
  let stops = [];
  rutasCusco.forEach(r => r.paraderos.forEach(p => { if (!stops.find(s => s.id === p.id)) stops.push(p); }));
  res.json(stops);
});

app.listen(process.env.PORT || 3001, () => { console.log(`Servidor en puerto ${process.env.PORT || 3001}`); });
