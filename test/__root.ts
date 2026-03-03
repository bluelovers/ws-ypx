import { join } from "path";

export const __ROOT = join(__dirname, '..');

export const isWin = process.platform === "win32";

export const __TEST_ROOT = join(__ROOT, 'test');
export const __TEST_FIXTURES = join(__TEST_ROOT, 'fixtures');
