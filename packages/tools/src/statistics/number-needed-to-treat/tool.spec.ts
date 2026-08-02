import { describe, expect, it } from "vitest";
import { numberNeededToTreatExample, runNumberNeededToTreat } from "./tool.js";
describe("Number Needed to Treat Calculator", () => {
  it("calculates a valid result", () => {
    const result = runNumberNeededToTreat({
      treatmentRate: 0.1,
      controlRate: 0.2,
    });
    expect(result.ok && result.output.numberNeededToTreat).toBeCloseTo(10);
  });
  it("rejects invalid input", () =>
    expect(runNumberNeededToTreat(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runNumberNeededToTreat(numberNeededToTreatExample.input).ok).toBe(
      true,
    ));
});
