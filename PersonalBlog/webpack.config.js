import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  mode: "production",
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "final.js",
  },

  target: "node",
};
