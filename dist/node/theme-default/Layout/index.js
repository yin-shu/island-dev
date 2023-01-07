"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
const react_1 = require("react");
function Layout() {
    const [count, setCount] = (0, react_1.useState)(0);
    return (<div>
      <h1>this is layout component</h1>
      <div>
        {count}
        <button onclick={() => setCount(count + 1)}>Add count</button>
      </div>
    </div>);
}
exports.Layout = Layout;
