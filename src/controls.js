// @flow
import React from 'react'
import { makeStyles, withStyles } from '@material-ui/styles'
import {
  Button as MuiButton,
  IconButton
} from '@material-ui/core'
import GpsIcon from './gps.svg'

type MapControlsStlyes = {|
  root: Object,
  button: Object
|}

const mapControlsStlyes: MapControlsStlyes = makeStyles(theme => ({
  root: {
    padding: '40px 40px',
    display: 'flex',
    flexDirection: 'row'
  }
}))

//////////// COMPONENT ///////////////////

type Props = {|
  centerMap: () => void,
  clearPolygons: () => void,
  hideClearButton: boolean
|}

/**
 * Map Controls
 * @summary Yard Maping Buttons Overlay Container 
 * @param {Props} props - Component properties
 * @return {JSX} - Controls to render
 */
const Controls: Props = ({
  clearPolygons,
  hideClearButton,
  centerMap
}) => {
  const classes = mapControlsStlyes()

  return (
    <div className={classes.root}>
      {!hideClearButton &&
      <ClearBtn 
        onClick={clearPolygons}>
        {'CLEAR'}
      </ClearBtn>
      }
      <IconButton
        style={{ padding: '0 24px'}}
        onClick={centerMap}>
          <img
            style={{ width: '32px'}}
            src={GpsIcon}
            title={'center map'}
            alt={'center-icon'} />
      </IconButton>
    </div>
  )
}

//////////// BUTTON WRAPPERS ///////////////////

const Button = withStyles(theme => ({
  root: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255, 255, 255, .8)',
    borderRadius: '32px',
    color: '#ffffff',
    fontSize: '13px',
    height: '28px',
    lineHeight: '13px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.8)'
    },
  }
}))(MuiButton)

const ClearBtn = ({ children, ...props }) => (
  <Button {...props}>
    {children}
  </Button>
)

export default Controls
