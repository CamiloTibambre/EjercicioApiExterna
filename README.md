# REST Countries API — Integración con Node.js

Proyecto académico desarrollado para el taller de **Investigación y Consumo de APIs Externas** — ADSO 2026, SENA.

## Descripción

Servidor backend en **Node.js + Express** que consume la API pública [REST Countries](https://restcountries.com/) para consultar información detallada sobre países del mundo.

## Tecnologías utilizadas

- Node.js
- Express
- Axios
- dotenv

## Instalación

```bash
git clone <url-del-repositorio>
cd rest-countries-api
npm install
```

Crear un archivo `.env` en la raíz (ver `.env.example`):

```
PORT=3000
```

## Ejecución

```bash
node src/index.js
```

## Endpoints

### GET `/countries`
Retorna todos los países con campos básicos.

**Respuesta:**
```json
{
  "success": true,
  "total": 250,
  "data": [ ... ]
}
```

---

### GET `/countries/name/:name`
Busca un país por nombre.

**Ejemplo:** `GET /countries/name/colombia`

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [ { "name": { "common": "Colombia" }, ... } ]
}
```

**Respuesta fallida (404):**
```json
{
  "success": false,
  "message": "No se encontró el país: \"xyz\""
}
```

---

### GET `/countries/region/:region`
Filtra países por región geográfica.

Regiones válidas: `Africa`, `Americas`, `Asia`, `Europe`, `Oceania`

**Ejemplo:** `GET /countries/region/Americas`

---

### POST `/countries/search`
Búsqueda avanzada de múltiples países en una sola petición.

**Body:**
```json
{
  "names": ["colombia", "peru", "chile"]
}
```

**Respuesta:**
```json
{
  "success": true,
  "searched": 3,
  "found": 3,
  "notFound": [],
  "data": [ ... ]
}
```

## Manejo de errores

- Códigos HTTP correctos en cada respuesta (`200`, `400`, `404`, `500`)
- Mensajes descriptivos en español
- Try/catch en todos los endpoints
- Validación de entrada en el endpoint POST

## Seguridad

- Variables de entorno gestionadas con `.env`
- El archivo `.env` está excluido del repositorio vía `.gitignore`
- No se exponen credenciales en el código fuente

## Autor

Camilo — Aprendiz ADSO 2026, SENA
