import { describe, expect, it } from "vitest";
import {
  calculateBroadstrikeDiameterExpansion,
  example,
  runBroadstrikeDiameterExpansion,
} from "./tool.js";

describe("numismatics/broadstrike-diameter-expansion", () => {
  it("calculates the published example", () => {
    expect(calculateBroadstrikeDiameterExpansion(example.input)).toEqual(
      example.output,
    );
    expect(runBroadstrikeDiameterExpansion(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runBroadstrikeDiameterExpansion({
      ...example.input,
      struckDiameterMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runBroadstrikeDiameterExpansion({
        ...example.input,
        normalDiameterMillimeters: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "normalDiameterMillimeters" }] },
    });
  });
});
