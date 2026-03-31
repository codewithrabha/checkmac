# CheckMac

CheckMac is a system analysis tool that quickly verifies if your local Windows machine's hardware is compatible with macOS using the OpenCore bootloader (Hackintosh setup).

---

## 🧑‍💻 For Users (Download & Usage)

If you simply want to check your hardware, you don't need to touch any code! Just download the standalone application.

### 1. Download
1. Visit the [Releases page on GitHub](https://github.com/codewithrabha/checkmac/releases).
2. Download the latest `.exe` setup file for Windows.
3. Run the installer and open CheckMac.

### 2. User Manual
- **Launch the App:** Open CheckMac from your desktop or start menu.
- **Start Scan:** Click the blue **"Start scan"** button on the home screen.
- **Review Results:** Wait a few seconds for the hardware engine to analyze your system. It will display a breakdown of your **Processor, Graphics, and Memory**, along with a clear verdict on whether your PC is Hackintosh compatible.
- **Credits & GitHub:** You can find short credits and a link back to this repository in the bottom footer.

---

## 🛠️ For Developers (Run Locally & Contribute)

If you are a developer looking to explore the codebase, update compatibility evaluation rules, or contribute to the project, follow these instructions.

### Tech Stack / Architecture
CheckMac uses modern web technologies packaged into a native desktop app:
- **Electron** (Backend system process, hardware scanning, and secure IPC bridge)
- **React + Vite** (Swift frontend rendering block)
- **Tailwind CSS v4** (Utility-first styling)

### Getting Started

1. **Fork the Repository**
   Click the "Fork" button at the top right of this repository to create your own copy.

2. **Clone your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/checkmac.git
   cd checkmac
   ```

3. **Install Dependencies**
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

4. **Run the App Locally**
   You will need to run two separate scripts to bring up both the frontend auto-reloading UI Server and the Electron wrapper.
   
   *In Terminal 1 (Start the React UI via Vite)*:
   ```bash
   npm run dev
   ```
   
   *In Terminal 2 (Start the Electron Window)*:
   ```bash
   npm run electron
   ```

### Building for Production

If you want to compile your own `.exe` installer locally using Electron-Builder, run:
```bash
npm run dist
```
Once the process completes, the final standalone setup will be generated inside your output folder.

### Contributing

Contributions, issues, and feature requests are welcome!
1. Checkout a new branch for your feature (`git checkout -b feature/amazing-feature`)
2. Commit your modifications (`git commit -m 'feat: Add some amazing feature'`)
3. Push back to your fork (`git push origin feature/amazing-feature`)
4. Open a **Pull Request** on this repository!

---
> If you find CheckMac helpful in your Hackintosh configuration journey, please consider giving the repository a ⭐️! 
*Created by [Abhijit Rabha](https://github.com/codewithrabha)*
