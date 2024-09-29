import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import globalStore from './state/globalStore'
import { createStore, StoreProvider } from 'easy-peasy'
import { IGlobalStore } from './interfaces'

const store = createStore<IGlobalStore>(globalStore);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </StrictMode>,
)
