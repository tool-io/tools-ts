import { describe, expect, it } from "vitest";
import { calculateManhattanDistance } from "./tool.js";
describe("Manhattan distance", () => { it("sums absolute coordinate differences", () => expect(calculateManhattanDistance({ first: [1, 2, 3], second: [4, 0, 3] })).toEqual({ ok: true, output: { distance: 5 } })); it("rejects mismatched dimensions", () => expect(calculateManhattanDistance({ first: [1], second: [1, 2] }).ok).toBe(false)); });
