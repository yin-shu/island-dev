"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const App_1 = require("./App");
const server_1 = require("react-dom/server");
function render() {
    return (0, server_1.renderToString)(App_1.App);
}
exports.render = render;
