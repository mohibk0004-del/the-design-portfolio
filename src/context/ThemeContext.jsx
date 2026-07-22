import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = ['dark', 'light']

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextIndex = (themes.indexOf(prev) + 1) % themes.length
      return themes[nextIndex]
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
