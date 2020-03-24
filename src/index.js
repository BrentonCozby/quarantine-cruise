import React from 'react'
import ReactDOM from 'react-dom'
import 'whatwg-fetch'
import * as serviceWorker from './serviceWorker'
import {ConfigProvider} from 'antd'

import 'css/sanitize.css'
import 'css/html5boilerplate.css'

import App from './App'

ReactDOM.render(
  <ConfigProvider>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </ConfigProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
