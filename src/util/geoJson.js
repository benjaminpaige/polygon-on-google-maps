import * as geolib from 'geolib'

// Typing /////////////////////////////////////////////////////////////////////

export type Latitude = number

export type Longitude = number

export type Coordinate = { lat: Latitude, lng: Longitude }

/** See: https://en.wikipedia.org/wiki/ISO_6709#Order,_sign,_and_units */
export type GeoJsonCoordinates = [Longitude, Latitude]

export type GeoJson = {|
  type: string,
  features: Array<Object>
|}

export type GeoJsonGeometry = {|
  type: 'MultiPolygon' | 'LineString',
  crs?: Object,
  coordinates: Array<*>
|}

export type DataPoint = {
  latitude: Latitude,
  longitude: Longitude,
  META?: any
}

export type LineString = Array<[number, number]>

// Mapping ////////////////////////////////////////////////////////////////////

export type CoordDatum = {
  coordinates: GeoJsonCoordinates
}

/**
 * Map GeoJson to scatter plot data
 * @param {object} geo - GeoJson
 * @returns {object} - Scatter Plot Data; See: https://github.com/uber/deck.gl/blob/master/docs/layers/scatterplot-layer.md
 */
export const mapGeoJsonToScatterPlot = (geo: GeoJson): ScatterPlotData => {
  const datum: { radius: number, color: [number, number, number] } = {
    radius: 50,
    color: [255, 0, 0]
  }
  return geo.features.map((feature: Object) => ({
    ...datum,
    position: feature.geometry.coordinates,
    META: {
      feature: feature
    }
  }))
}

/**
 * Convert url param bounds (LineString) to GeoJsonGeometry
 * @param  {object} bounds - LineString
 * @return {object}     - GeoJsonGeometry object
 */
export const getGeoJsonGeometryForUrlBounds = (
  bounds: LineString
): GeoJsonGeometry => ({
  type: 'LineString',
  coordinates: bounds
})

/* eslint-disable camelcase */
/**
 * Convert GeoJsonGeometry to bounding box object
 * @param  {object} geometry - GeoJsonGeometry
 * @return {object}     - Bounding box object
 */
export const getBoundingBoxForGeoJsonGeometry = (
  geometry: GeoJsonGeometry
): BoundingBoxObject => {
  let coords = []

  // MultiPolygons are nested [[[[long, lat]]]]
  if (geometry.type === 'MultiPolygon') {
    // XXX Do NOT nest these reducers, can hit issues with long data arrays getting
    // truncated

    // Flatten 1st level
    coords = geometry.coordinates.reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])

    // Flatten 2nd level
    coords = coords.reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])

    // LineStrings are [[long, lat]]
  } else if (geometry.type === 'LineString') {
    coords = geometry.coordinates
  }

  // Make sure we have at least ont coordinate pair
  if (coords.length < 1 || coords[0].length < 1) {
    return {}
  }

  // find the min/max lat/longs out of all coordinates
  return {
    min_lat: coords.reduce((min, curr) => Math.min(min, curr[1]), coords[0][1]),
    max_lat: coords.reduce((max, curr) => Math.max(max, curr[1]), coords[0][1]),
    min_long: coords.reduce(
      (min, curr) => Math.min(min, curr[0]),
      coords[0][0]
    ),
    max_long: coords.reduce((max, curr) => Math.max(max, curr[0]), coords[0][0])
  }
}
/* eslint-enable camelcase */

/**
 * Given the current state and coordinates, determine the id for the
 * new coordinates in the state
 * @param {Object} state - Redux state
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @return {string} - New ID
 */
export const createCoordinateBasedId = (
  state: State,
  latitude: Latitude,
  longitude: Longitude
): string => {
  /** ID created from combined lat/lng */
  let id: string = `${latitude}_${longitude}`
  /** Regex looking for string that start with the new id */
  const idRegex: RegExp = new RegExp('^' + id)
  /** Array of ids matching the regex */
  const exisitingIds: Array<string> = Object.keys(state).filter(exisitingId =>
    idRegex.test(exisitingId)
  )

  id = id + '-' + exisitingIds.length

  return id
}

/**
 * Given array of lat lng objects get toal area in square meters
 * @param {Array<Coordinate>} coords - Array of lat/lng objects
 * @return {number} - area in square meters
 */
export const getAreaFromCoords = (coords: Array<Coordinate>): number => {
  const area = coords.map(ll => [ll.lat, ll.lng])
  return Math.round(geolib.getAreaOfPolygon(area))
}

/**
 * Given polygon instance get array of coordinates
 * @param {Object} polygon - polygon instance from google drawing manager
 * @return { Array<Coordinate> } - array of lat/lng objects
 */
export const getCoordsFromPolygon = (polygon: Object): Array<Coordinate> => {
  const vertices = polygon.getPath()
  const coords = []
  // eslint-disable-next-line no-var
  for (var i = 0; i < vertices.getLength(); i++) {
    const xy = vertices.getAt(i)
    coords.push({ lat: xy.lat(), lng: xy.lng() })
  }
  return coords
}
