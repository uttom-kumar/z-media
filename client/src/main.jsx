import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/index.css'
import {Toaster} from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Toaster position="top-center" toastOptions={{ style: { zIndex: 9999 } }}/>
      <App />
  </StrictMode>,
)
