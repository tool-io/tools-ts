import { describe, expect, it } from "vitest";
import { calculateSumOfSquares } from "./tool.js";
describe("sum of squares", () => { it("sums deviations around the mean", () => expect(calculateSumOfSquares({ values: [1, 2, 3] })).toEqual({ ok: true, output: { mean: 2, sumOfSquares: 2 } })); it("rejects empty input", () => expect(calculateSumOfSquares({ values: [] }).ok).toBe(false)); });
