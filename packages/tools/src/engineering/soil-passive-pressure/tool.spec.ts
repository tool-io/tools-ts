import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSoilPassivePressure, example } from "./tool.js";

describe("engineering/soil-passive-pressure", () => {
  it("matches its worked example", () => {
    expect(calculateSoilPassivePressure(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, frictionAngleDegrees: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects an input outside the stated model", () => {
    expect(
      tool.execute({ ...example.input, frictionAngleDegrees: 90 }).ok,
    ).toBe(false);
  });
  it("matches an independently calculated reference", () => {
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: { pressurePascals: expect.closeTo(108000, 6) },
    });
  });
});
