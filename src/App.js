// @flow
import React, { useEffect, useState, useRef } from 'react'
import MapControls from './controls.js'
import MapLottie from './MapLottie'
import MyPolygon from './Polygon'
import PropTypes from 'prop-types'
import backArrow from './backArrow.png'
import uuid from 'uuid/v1'
import { DrawingManager } from 'react-google-maps/lib/components/drawing/DrawingManager'
import { MAP } from 'react-google-maps/lib/constants'
import { Typography } from '@material-ui/core'
import { createPortal } from 'react-dom'
import {
  getCoordsFromPolygon,
  getAreaFromCoords
} from './util/geoJson'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap
} from 'react-google-maps'

//////////// TYPES ////////////////////

type DefaultMapOptions = {|
  disableDefaultUI: boolean,
  fullscreenControl: boolean,
  styles: Object,
  zoomControl: boolean,
|}

type HelperText = {|
  polygon: string,
  null: string
|}

export type Coordinate = {|
  lat: number,
  lng: number
|}

type PolygonStyleOption = {|
  fillColor: string,
  fillOpacity: number,
  strokeWeight: number,
  strokeColor: string
|}

type PolygonType = {|
  id: string,
  coords: Array<Coordinate>,
  area: number
|}

//////////// CONSTANTS ///////////////////

const DEFAULT_CONTROLS_POSITION: 1 = 1 // UPPER LEFT CORNER
const DEFAULT_MAP_TYPE: 'satellite' = 'satellite'
const DEFAULT_TILT: 0 = 0
const DEFAULT_ZOOM: 20 = 20
const GOOGLE_MAP_URL: string = `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY || ''}`
const POLYGON: 'polygon' = 'polygon'
const POLYGON_BORDER_COLOR: '#00A7E1' = '#00A7E1'
const POLYGON_COLOR: 'rgba(0,167,225,0.4)' = 'rgba(0,167,225,0.4)'

const HELPER_TEXT: HelperText = {
  polygon: 'Connect last point to the first to complete shape',
  null: 'Tap to add to lawn area. Press and hold points to move'
}

const DEFAULT_LOADING_ELEMENT: React.Element<'div'> = <div style={{ height: `100%` }} />

const POLYGON_STYLE_OPTIONS: PolygonStyleOption = {
  fillColor: POLYGON_COLOR,
  fillOpacity: 0.2,
  strokeWeight: 2,
  strokeColor: POLYGON_BORDER_COLOR
}

const HEADER_BANNER_STYLES: Object = {
  height: '96px',
  textAlign: 'center',
  backgroundColor: '#00293B',
  color: '#ffffff',
  opacity: .86,
  display: 'flex',
  alignItems: 'center'
}

// set default map option properties: https://www.w3resource.com/API/google-maps/google-maps-class-propertes-controls.php#MO
const DEFAULT_MAP_OPTIONS: DefaultMapOptions = {
  fullscreenControl: false,
  disableDefaultUI: true,
  zoomControl: false,
  styles: { height: '100%' }
}

//////////// COMPONENT ///////////////////

type Props = {
  center: Coordinate,
  submit: () => void,
  handleBack: () => void
}

/**
 * Yard mapping component
 * @summary Yard Mapping Component
 * @param {Props} props - Component properties
 * @return {JSX} - Rendered Yard Map
 */
const Map = ({
    center,
    submit,
    handleBack
  }: Props ) => {

  const mapRef = useRef(null)

  const [polygons, setPolygons] = useState([])

  const [lottieOpen, setLottieOpen] = useState(true)

  const [drawingMode, setDrawingMode] = useState(POLYGON)

  /**
   * Handles polygon completion from drawing manager
   * @param {Object} polygon - Polygon from drawing manager
   */
  const handleCompletedPolygon = (polygon: Object) => {
    addControlledPolygonToMap(polygon)
    polygon.setMap(null)
    setDrawingMode(null)
  }

  /**
   * Adds controlled polygon to state with area and id
   * @param {Object} drawnPolygon - Polygon from drawing manager
   */
  const addControlledPolygonToMap = (drawnPolygon: Object) => {
    const path = getCoordsFromPolygon(drawnPolygon)
    const area = getAreaFromCoords(path)

    const polygon: PolygonType = {
      id: uuid(),
      path,
      area
    }
    setPolygons([...polygons, polygon])
  }

  /**
   * Replaces polygon with new values after beign edited
   * @param {Array<Coordinates>} path - path
   * @param {string} id - id of polygon
   */
  const editPolygon = (path, id) => {
    const area = getAreaFromCoords(path)
    setPolygons(
      [...polygons.filter((p) => p.id !== id),
        { id, path, area }]
      )
  }

  /** Removes all controlled polygons */
  const clearPolygons = () => {
    setPolygons([])
    enterDrawingMode()
  }

  /** Centers map with initial coords */
  const centerMap = () => mapRef.current.panTo(center)

  /** Sets drawing manager into drawing mode */
  const enterDrawingMode = () => setDrawingMode(POLYGON)

  return (
    <GoogleMap
      ref={mapRef}
      onClick={enterDrawingMode}
      defaultZoom={DEFAULT_ZOOM}
      defaultTilt={DEFAULT_TILT}
      defaultCenter={center}
      mapTypeId={DEFAULT_MAP_TYPE}
      defaultOptions={DEFAULT_MAP_OPTIONS}
    >
      <MapLottie
        open={lottieOpen}
        closeLottie={() => setLottieOpen(false)}
        />
      <MapControlsWrapper position={DEFAULT_CONTROLS_POSITION}>
        {!lottieOpen && 
        <div
          style={HEADER_BANNER_STYLES}>
            {/* img placeholder for the back arrow prop*/}
            <img
              onClick={handleBack}
              src={backArrow}
              alt={'back-arrow'}
              style={{
                width: 32,
                marginLeft: 48,
                float: 'left'
              }}
              />
            {/* Placeholder for typography */}
            <Typography
              color='inherit'
              style={{
                  flex: 1,
                  padding: '32px auto',
                  'fontSize': '20px'
                }}>
              {HELPER_TEXT[drawingMode]}
            </Typography>
          </div>}
        <MapControls
          clearPolygons={clearPolygons}
          hideClearButton={polygons.length === 0 || Boolean(drawingMode)}
          centerMap={centerMap}
        />
      </MapControlsWrapper>
      <DrawingManager
        drawingMode={drawingMode}
        onPolygonComplete={handleCompletedPolygon}
        defaultOptions={{
          drawingControl: false,
          polygonOptions: {
            ...POLYGON_STYLE_OPTIONS,
            editable: true
          }
        }}
      />
      {polygons.map((polygon) => (
        <UserDrawnPolygon
          id={polygon.id}
          key={polygon.id}
          path={polygon.path}
          polygonsEditable={!drawingMode}
          editPolygon={editPolygon}
          />
      ))}
    </GoogleMap>
  )
}

///////////// POLYGON WRAPPER /////////////////////

type UserDrawnPolygonProps = {|
  id: string,
  options: typeof POLYGON_STYLE_OPTIONS,
  path: Array<Coordinate>,
  polygonsEditable: boolean,
  setPath: () => void
|}

/**
 * Polygon Wrapper
 * @param {UserDrawnPolygonProps} props - component props
 */
const UserDrawnPolygon = (props: UserDrawnPolygonProps) => (
  <MyPolygon {...props} options={POLYGON_STYLE_OPTIONS} />
  )

////////////// MAP CONTROLLS WRAPPER ///////////////

type MapControlsWrapperProps = {
  position: typeof DEFAULT_CONTROLS_POSITION,
  children: any,
  getInitialPos: () => void
}

/**
 * Map Controls Wrapper
 * @param {MapControlsWrapperProps} props - component props
 * @param {Object} content - context 
 * @return {Function} - Controls portal
 */
const MapControlsWrapper = (
  { position, children }: MapControlsWrapperProps,
  context: Object
) => {
  const map = context[MAP]
  const controlDiv = document.createElement('div')

  useEffect(() => {
    const controls = map.controls[position]
    const index = controls.length
    controls.push(controlDiv)
    return () => {
      controls.removeAt(index)
    }
  })

  return createPortal(
    <div style={{ width: '100vw' }}>{children}</div>,
    controlDiv
  )
}

MapControlsWrapper.contextTypes = {
  [MAP]: PropTypes.object
}

/** Injects Map eith google maps script */
const MapWrapped = withScriptjs(withGoogleMap(Map))

/**
 * Map Container Wrapper
 * @param {Props} props - component props
 * @return {JSX} - Wrapped Map JSX
 */
const MapContainer = (props: Props) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <MapWrapped
      googleMapURL={GOOGLE_MAP_URL}
      loadingElement={DEFAULT_LOADING_ELEMENT}
      containerElement={DEFAULT_LOADING_ELEMENT}
      mapElement={DEFAULT_LOADING_ELEMENT}
      {...props}
    />
  </div>
)

export default MapContainer
