import { describe, expect, it } from "vitest";
import { runIsoelectricPoint } from "./tool.js";
describe("Isoelectric Point Calculator", () => {
  it("calculates a valid result", () =>
    expect(runIsoelectricPoint({ pKa1: 2.34, pKa2: 9.6 })).toEqual({
      ok: true,
      output: { isoelectricPoint: 5.97 },
    }));
  it("accepts negative pKa values", () =>
    expect(runIsoelectricPoint({ pKa1: -1.7, pKa2: 7.5 }).ok).toBe(true));
});
