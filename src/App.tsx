import { useEffect, useState } from 'react'
import './App.css'

declare const chrome: any

function App() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Pobierz stan darkmode z chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['firebaseDarkmodeEnabled'], (result: any) => {
        setEnabled(!!result.firebaseDarkmodeEnabled)
      })
    }
  }, [])

  const toggleDarkmode = () => {
    const newValue = !enabled
    setEnabled(newValue)
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ firebaseDarkmodeEnabled: newValue })
    }
    // Wyślij message do content script, żeby przełączyć darkmode
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_DARKMODE', enabled: newValue })
        }
      })
    }
  }

  return (
    <div className="p-4 min-w-[220px] bg-zinc-900 text-white rounded shadow-lg flex flex-col items-center">
      <h1 className="text-lg font-bold mb-2">Firebase Emulators Darkmode</h1>
      <button
        className={`px-4 py-2 rounded font-semibold transition-colors ${enabled ? 'bg-purple-600' : 'bg-zinc-700'} hover:bg-purple-700`}
        onClick={toggleDarkmode}
      >
        {enabled ? 'Wyłącz darkmode' : 'Włącz darkmode'}
      </button>
    </div>
  )
}

export default App
