import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateServoPulseWidthFromAngle, example } from "./tool.js";

describe("electronics/servo-pulse-width-from-angle", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateServoPulseWidthFromAngle(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, angleDegrees: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      angleDegrees: -1,
      minimumAngleDegrees: 0,
      maximumAngleDegrees: 180,
      minimumPulseMicroseconds: 1000,
      maximumPulseMicroseconds: 2000,
    });
    expect(result).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_value", field: "angleDegrees" }] },
    });
  });
});
