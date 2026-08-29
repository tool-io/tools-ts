import { describe, expect, it } from "vitest";
import { runVantHoffFactor } from "./tool.js";

describe("Van't Hoff Factor Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runVantHoffFactor({ degreeOfDissociation: 1, ionsPerUnit: 3 }),
    ).toEqual({ ok: true, output: { vantHoffFactor: 3 } });
    expect(
      runVantHoffFactor({ degreeOfDissociation: 0.5, ionsPerUnit: 3 }),
    ).toEqual({ ok: true, output: { vantHoffFactor: 2 } });
  });

  it("rejects invalid input", () =>
    expect(runVantHoffFactor(null).ok).toBe(false));
});
