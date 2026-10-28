const axios = require('axios');
async function getRoute(origin, destination) {
  try {
    const geo = async (q) => {
      const r = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: q, format: 'json', limit: 1 }, headers: { 'User-Agent': 'CuscoBus/1.0' }
      });
      if (!r.data[0]) throw new Error(`No se encontró: ${q}`);
      return { lat: r.data[0].lat, lon: r.data[0].lon };
    };
    const [o, d] = await Promise.all([geo(origin), geo(destination)]);
    const url = `https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}`;
    const r = await axios.get(url, { params: { overview: 'full', geometries: 'polyline' } });
    return {
      distance: `${(r.data.routes[0].distance / 1000).toFixed(2)} km`,
      duration: `${Math.round(r.data.routes[0].duration / 60)} min`,
      polyline: r.data.routes[0].geometry
    };
  } catch (error) { throw new Error(error.message); }
}
module.exports = { getRoute };
