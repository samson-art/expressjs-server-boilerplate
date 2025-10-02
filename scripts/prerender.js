"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// @ts-ignore
const react_1 = __importDefault(require("react"));
// @ts-ignore
const server_1 = require("react-dom/server");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - path is relative to project root during ts-node
const App_1 = require("../client/src/ui/App");
function injectMarkupIntoIndexHtml(html, appHtml) {
    return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}
async function main() {
    const outDir = path_1.default.join(process.cwd(), 'client', 'dist', 'client');
    const indexPath = path_1.default.join(outDir, 'index.html');
    if (!fs_1.default.existsSync(indexPath)) {
        throw new Error('client/dist/client/index.html not found. Run "npm run build:client" first.');
    }
    const builtHtml = fs_1.default.readFileSync(indexPath, 'utf-8');
    const appHtml = (0, server_1.renderToString)(react_1.default.createElement(App_1.App));
    const finalHtml = injectMarkupIntoIndexHtml(builtHtml, appHtml);
    fs_1.default.writeFileSync(indexPath, finalHtml, 'utf-8');
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=prerender.js.map