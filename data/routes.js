const rutasCusco = [
  {
    id: "rtu01", 
    nombre: "RTU-01: Patrón de San Jerónimo", 
    color: "#ef4444",
    horario: "05:00 - 22:00", 
    duracion: "61 min",
    paradasTotales: 92,
    descripcion: "Ruta troncal. Conecta Final Cachona (Santiago) con Peaje (San Jerónimo). Pasa por el Mercado de Huancaro, Plaza Santiago, Wanchaq, la UNSAAC, el Hospital Regional y la Universidad Andina.",
    foto: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    paraderos: [
      { id: 1, nombre: "Final Cachona", lat: -13.5280, lng: -71.9450 },
      { id: 2, nombre: "Mercado De Huancaro", lat: -13.5250, lng: -71.9550 },
      { id: 3, nombre: "Plaza Santiago", lat: -13.5225, lng: -71.9675 },
      { id: 4, nombre: "Wanchaq", lat: -13.5180, lng: -71.9785 },
      { id: 5, nombre: "Universidad San Antonio Abad", lat: -13.5205, lng: -71.9810 },
      { id: 6, nombre: "Hospital Regional", lat: -13.5215, lng: -71.9680 },
      { id: 7, nombre: "Universidad Andina", lat: -13.5350, lng: -71.9280 },
      { id: 8, nombre: "Peaje", lat: -13.5550, lng: -71.8800 }
    ]
  },
  {
    id: "rtu02", 
    nombre: "RTU-02: Satélite", 
    color: "#8b5cf6",
    horario: "05:00 - 22:00", 
    duracion: "50-55 min",
    paradasTotales: 82,
    descripcion: "Conecta la zona alta de Kantu con el centro histórico y San Jerónimo. Pasa por la Plaza de Armas, el Qoricancha y el Mercado de Ttio.",
    foto: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    paraderos: [
      { id: 20, nombre: "Apv. Kantu", lat: -13.4950, lng: -72.0050 },
      { id: 21, nombre: "Plazoleta Santa Ana", lat: -13.5150, lng: -71.9850 },
      { id: 22, nombre: "Plaza San Francisco", lat: -13.5170, lng: -71.9800 },
      { id: 23, nombre: "Qoricancha", lat: -13.5180, lng: -71.9780 },
      { id: 24, nombre: "Mercado De Ttio", lat: -13.5250, lng: -71.9600 },
      { id: 25, nombre: "Universidad Andina", lat: -13.5350, lng: -71.9280 },
      { id: 26, nombre: "San Juan", lat: -13.5400, lng: -71.9100 }
    ]
  },
  {
    id: "rtu04", 
    nombre: "RTU-04: El Dorado", 
    color: "#f59e0b",
    horario: "05:00 - 22:00", 
    duracion: "43 min",
    paradasTotales: 47,
    descripcion: "Conecta Almudena con San Jerónimo, pasando por el Aeropuerto Velasco Astete y la Avenida de la Cultura.",
    foto: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    paraderos: [
      { id: 30, nombre: "Almudena", lat: -13.5100, lng: -71.9900 },
      { id: 31, nombre: "Mercado De Ttio", lat: -13.5250, lng: -71.9600 },
      { id: 32, nombre: "Aeropuerto", lat: -13.5350, lng: -71.9380 }
    ]
  },
  {
    id: "rtu05", 
    nombre: "RTU-05: Pegaso", 
    color: "#10b981",
    horario: "06:00 - 22:00", 
    duracion: "69 min",
    paradasTotales: 66,
    descripcion: "Ruta que conecta Capilla con la A.P.V. Vallecito, pasando por el centro histórico y la Plaza San Francisco.",
    foto: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    paraderos: [
      { id: 40, nombre: "Capilla", lat: -13.5200, lng: -71.9750 },
      { id: 41, nombre: "La Salle", lat: -13.5175, lng: -71.9780 },
      { id: 42, nombre: "A.P.V. Vallecito", lat: -13.5450, lng: -71.9000 }
    ]
  },
  {
    id: "rtu07", 
    nombre: "RTU-07: Inka Express", 
    color: "#14b8a6",
    horario: "05:30 - 10:30", 
    duracion: "32 min",
    paradasTotales: 63,
    descripcion: "Conecta Final Cachona (Santiago) con Ayuda Mutua (Cusco). Pasa por el centro histórico y sube hasta la zona norte. Ideal para viajes de la mañana.",
    foto: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    paraderos: [
      { id: 50, nombre: "Final Cachona", lat: -13.5280, lng: -71.9450 },
      { id: 51, nombre: "Mercado De Huancaro", lat: -13.5250, lng: -71.9550 },
      { id: 52, nombre: "Calle Nueva", lat: -13.5180, lng: -71.9800 },
      { id: 53, nombre: "Matara", lat: -13.5170, lng: -71.9820 },
      { id: 54, nombre: "Mariscal Gamarra", lat: -13.5150, lng: -71.9850 },
      { id: 55, nombre: "Ayuda Mutua", lat: -13.5050, lng: -71.9950 }
    ]
  },
  {
    id: "rtu08", 
    nombre: "RTU-08: Wimpillay", 
    color: "#0ea5e9",
    horario: "05:00 - 22:30", 
    duracion: "42 min",
    paradasTotales: 68,
    descripcion: "Conecta la zona sur de Wimpillay y San Jerónimo con el centro histórico. Pasa por el Óvalo Pachacútec, la Avenida de la Cultura y la UNSAAC. Muy usada por estudiantes y trabajadores.",
    foto: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    paraderos: [
      { id: 60, nombre: "Wimpillay", lat: -13.5400, lng: -71.9100 },
      { id: 61, nombre: "Viva El Perú", lat: -13.5380, lng: -71.9200 },
      { id: 62, nombre: "Gral Ollanta", lat: -13.5350, lng: -71.9280 },
      { id: 63, nombre: "Ovalo Pachacuteq", lat: -13.5250, lng: -71.9600 },
      { id: 64, nombre: "Confraternidad", lat: -13.5200, lng: -71.9700 },
      { id: 65, nombre: "La Salle", lat: -13.5175, lng: -71.9780 },
      { id: 66, nombre: "Universidad San Antonio Abad", lat: -13.5205, lng: -71.9810 },
      { id: 67, nombre: "Primer Paradero San Sebastian", lat: -13.5250, lng: -71.9550 },
      { id: 68, nombre: "Final", lat: -13.5500, lng: -71.8900 }
    ]
  }
];
module.exports = rutasCusco;
