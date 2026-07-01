import { describe, expect, it } from "vitest";
import { calculateZScore } from "./tool.js";
describe("z score", () => { it("calculates standardized distance", () => expect(calculateZScore({ value: 15, mean: 10, standardDeviation: 2.5 })).toEqual({ ok: true, output: { zScore: 2 } })); it("rejects zero deviation", () => expect(calculateZScore({ value: 1, mean: 1, standardDeviation: 0 }).ok).toBe(false)); });
