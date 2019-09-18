import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <App
        center={{ lat: 39.744031, lng: -105.1014172 }}
        submit={() => console.log('yeah you did')}
        handleBack={() => console.log('clicked back')}
        />
    , document.getElementById('root'))

serviceWorker.unregister()
