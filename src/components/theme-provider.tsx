import * as React from 'react';

// Simple theme provider that always uses light theme
const ThemeContext = React.createContext({
  theme: 'light' as const,
  setTheme: (_: 'light') => {},
  resolvedTheme: 'light' as const
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light'>('light');
  
  // Ensure the light theme class is always applied
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    
    // Clean up function
    return () => {
      root.classList.remove('light');
    };
  }, []);

  const value = React.useMemo(() => ({
    theme: 'light',
    setTheme: () => {},
    resolvedTheme: 'light'
  }), []);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export as default for backward compatibility
export default ThemeProvider;
