import { describe, expect, it } from "vitest";
import { runDegreeOfDissociation } from "./tool.js";

describe("Degree of Dissociation Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDegreeOfDissociation({ ionsPerUnit: 3, vantHoffFactor: 2 }),
    ).toEqual({ ok: true, output: { degreeOfDissociation: 0.5 } });
  });

  it("rejects invalid input", () =>
    expect(runDegreeOfDissociation(null).ok).toBe(false));
});
