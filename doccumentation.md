# CheckMac Documentation

CheckMac is a system analysis tool designed to check if local hardware is compatible with macOS and the OpenCore bootloader (Hackintosh setup).

## Architecture overview

The application uses an Electron-based architecture with separated processes for security and modularity. 

### Tech Stack
- **Framework:** Electron
- **Frontend library:** React
- **Styling:** Tailwind CSS
- **Bundler:** Vite
- **Process Communication:** Electron IPC (Inter-Process Communication)

## Project Structure

- `src/main/`: Core Electron back-end code.
  - `main.js`: Setup for the Electron window, loads the dev server or production build, and handles the `scan-system` IPC request.
  - `preload.js`: Isolates Node.js execution through context-bridge to securely expose the `window.electronAPI` methods to the frontend.
  - `scanner.js`: Handles backend system-level hardware scanning on the host machine.
- `src/renderer/`: Frontend React interface.
  - `App.jsx`: Main interface that manages scan state (welcome, scanning, error, results) and visual components.
  - `components/`: UI components (e.g., Header, Cards, Buttons).
- `src/shared/`: Shared business logic and configuration.
  - `compatibilityEngine.js`: Contains logic to evaluate hardware specifications.
  - `rules.json`: Configured rules determining component compatibility with OpenCore/macOS.

## How It Works

1. **User Action:** The user clicks "Scan" in the React frontend interface.
2. **IPC Call:** The renderer calls `window.electronAPI.scanSystem()`, passing the request through the `preload.js` bridge.
3. **Hardware Scan:** At the Main process side, `ipcMain.handle('scan-system', ...)` triggers `scanner.js` to assess the host machine's physical hardware component details (CPU, GPU, RAM, etc.).
4. **Compatibility Check:** The `compatibilityEngine.js` verifies the retrieved hardware metrics against the parameters defined in `rules.json`.
5. **UI Update:** Results are returned back to the renderer process, where the `App.jsx` handles state update (`setResults`), and the `VerdictCard` displays the definitive OpenCore/macOS hardware summary.

## Available Scripts

Defined in `package.json`:
- `npm run dev` - Starts Vite dev server for the React UI.
- `npm run electron` - Starts the Electron wrapper looking at the dev server.
- `npm run electron:dev` - Starts the Electron wrapper configured explicitly for development mode.
- `npm run build` - Builds the frontend application via Vite.
- `npm run start` - Builds the React app and then runs Electron directly.
- `npm run dist` - Builds the project and creates standalone executables using `electron-builder`.
