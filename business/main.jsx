import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Gasolineras from '../src/pages/Gasolineras.jsx'
import '../src/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Gasolineras standalone />
    </BrowserRouter>
  </React.StrictMode>,
)
