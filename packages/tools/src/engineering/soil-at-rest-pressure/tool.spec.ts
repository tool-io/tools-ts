import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSoilAtRestPressure, example } from "./tool.js";

describe("engineering/soil-at-rest-pressure", () => {
  it("matches its worked example", () => {
    expect(calculateSoilAtRestPressure(example.input)).toEqual(example.output);
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
      output: { pressurePascals: expect.closeTo(18000, 6) },
    });
  });
});
