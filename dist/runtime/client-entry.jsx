"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
const App_1 = require("./App");
function renderInBrowser() {
    const containerEl = document.getElementById('root');
    if (!containerEl) {
        throw new Error('#root element not found');
    }
    (0, client_1.createRoot)(containerEl).render(<App_1.App />);
}
renderInBrowser();
