import { join } from "path";

export const __ROOT_WS = join(__dirname);

export const isWin = process.platform === "win32";
