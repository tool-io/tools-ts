import { describe, expect, it } from "vitest";
import { calculateTScore } from "./tool.js";
describe("t score", () => { it("calculates a one-sample statistic", () => expect(calculateTScore({ sampleMean: 12, hypothesizedMean: 10, sampleStandardDeviation: 4, sampleSize: 16 })).toEqual({ ok: true, output: { degreesOfFreedom: 15, tScore: 2 } })); it("rejects zero deviation", () => expect(calculateTScore({ sampleMean: 1, hypothesizedMean: 1, sampleStandardDeviation: 0, sampleSize: 2 }).ok).toBe(false)); });
