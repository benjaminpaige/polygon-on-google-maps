// @flow
import React, { useRef, useCallback } from 'react'
import { Polygon } from 'react-google-maps'
import type { Coordinate } from './App'

type Props = {|
    id: string,
    options: Object,
    path: Array<Coordinate>,
    polygonsEditable: boolean,
    editPolygon: (Array<Coordinate>, string) => void
|}

/**
 * Controlled Polygon
 * @summary Editable Polygon Component 
 * @param {Props} props - Component properties
 * @return {JSX} - Polygon to render
 */
const MapPolygon: Props = ({
    id,
    options,
    path,
    polygonsEditable,
    editPolygon
}) => {

  /** Define refs for Polygon instance and listeners */
  const polygonRef = useRef(null)
  const listenersRef = useRef([])

  /** Call editPolygon with new edited path */
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const path = polygonRef.current
        .getPath()
        .getArray()
        .map(latLng => {
          return { lat: latLng.lat(), lng: latLng.lng() }
        })
      editPolygon(path, id)
    }
  }, [editPolygon])

  /** Bind refs to current polygon and listeners */
  const onLoad = useCallback(
    polygon => {
      polygonRef.current = polygon
      const path = polygon.getPath()
      listenersRef.current.push(
        path.addListener('set_at', onEdit),
        path.addListener('insert_at', onEdit),
        path.addListener('remove_at', onEdit)
      )
    },
    [onEdit]
  )

  /** Clean up refs */
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((listener) => listener.remove())
    polygonRef.current = null
  }, [])

  return (
    <Polygon
        ref={polygonRef}
        key={id}
        options={options}
        editable={polygonsEditable}
        path={path}
        onMouseUp={onEdit}
        onDragEnd={onEdit}
        onLoad={onLoad}
        onUnmount={onUnmount}/>
    )
}

export default MapPolygon