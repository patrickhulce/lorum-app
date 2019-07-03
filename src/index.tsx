import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

const NoSleep = require('nosleep.js')
const noSleep = new NoSleep()
document.addEventListener(
  'click',
  function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false)
    if (process.env.NODE_ENV === 'production') noSleep.enable()
  },
  false,
)
