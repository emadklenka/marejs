import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { themeQuartz, iconSetQuartzLight } from 'ag-grid-community';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Light theme configuration
const lightTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
    // Typography - matches Mulish font family
    fontFamily: "'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    headerFontSize: 14,
    
    // Spacing - matches design system
    spacing: 8,
    headerHeight: 52,
    rowHeight: 48,
    
    // Borders - matches rounded design
    borderRadius: 12,
    borderWidth: 1,
    
    // Light mode colors - matches Cascade design system
    backgroundColor: "#ffffff",
    foregroundColor: "#1d1652",
    headerBackgroundColor: "#f8f9ff",
    headerForegroundColor: "#1d1652",
    oddRowBackgroundColor: "#f8f9ff",
    borderColor: "#dadcfb",
    
    // Interactive states
    rowHoverColor: "rgba(89, 75, 219, 0.08)",
    selectedRowBackgroundColor: "rgba(89, 75, 219, 0.12)",
    
    // Controls - purple theme
    checkboxBorderColor: "#594BDB",
    checkboxCheckedColor: "#594BDB",
    
    // Column resize
    columnResizeHandleColor: "#594BDB",
    columnResizeHandleWidth: 2,
    
    // Scrollbar
    scrollbarWidth: 8,
    
    // Icons
    iconFontFamily: "'Lucide', sans-serif",
    iconSize: 16,
  });

// Dark theme configuration
const darkTheme = themeQuartz
  .withPart(iconSetQuartzLight)
  .withParams({
    // Typography
    fontFamily: "'Mulish', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    headerFontSize: 14,
    
    // Spacing
    spacing: 8,
    headerHeight: 52,
    rowHeight: 48,
    
    // Borders
    borderRadius: 12,
    borderWidth: 1,
    
    // Dark mode colors - matches Cascade design system
    backgroundColor: "#1a1443",
    foregroundColor: "#e5e7ff",
    headerBackgroundColor: "#0c0924",
    headerForegroundColor: "#e5e7ff",
    oddRowBackgroundColor: "#1a1443",
    borderColor: "#2d2663",
    
    // Interactive states
    rowHoverColor: "#2d2663",
    selectedRowBackgroundColor: "rgba(89, 75, 219, 0.2)",
    
    // Controls - dark mode purple
    checkboxBorderColor: "#752FCF",
    checkboxCheckedColor: "#752FCF",
    
    // Column resize
    columnResizeHandleColor: "#752FCF",
    columnResizeHandleWidth: 2,
    
    // Scrollbar
    scrollbarWidth: 8,
    
    // Icons
    iconFontFamily: "'Lucide', sans-serif",
    iconSize: 16,
  });

// Export theme function that returns appropriate theme based on current mode
export const getAgGridTheme = () => {
  // Get current theme from document
  if (typeof document !== 'undefined') {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    return currentTheme === 'dark' ? darkTheme : lightTheme;
  }
  return lightTheme;
};

// Export default theme (light mode)
export const agGridTheme = lightTheme;

// Export theme class name for CSS
export const AG_GRID_THEME_CLASS = 'ag-theme-quartz';