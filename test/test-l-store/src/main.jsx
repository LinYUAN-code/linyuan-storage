import React from 'react'
import ReactDOM from 'react-dom/client'
import { initStoreDeep } from '../../../src'
import App from './App'

let data = {
  user: {
    name: "linrenjun",
    a: {
      b: {
        age: 100
      }
    }
  }
}

initStoreDeep(data);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
