import { describe, expect, it } from "vitest";
import {
  calculatePremiumOverSpotPercent,
  example,
  runPremiumOverSpotPercent,
} from "./tool.js";

describe("numismatics/premium-over-spot-percent", () => {
  it("calculates the published example", () => {
    expect(calculatePremiumOverSpotPercent(example.input)).toEqual(
      example.output,
    );
    expect(runPremiumOverSpotPercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPremiumOverSpotPercent({
      ...example.input,
      askingPrice: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runPremiumOverSpotPercent({ ...example.input, metalValue: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "metalValue" }] },
    });
  });
});
