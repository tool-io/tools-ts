import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateExtrusionRatio2, example } from "./tool.js";

describe("engineering/extrusion-ratio-2", () => {
  it("matches its worked example", () => {
    expect(calculateExtrusionRatio2(example.input)).toEqual(example.output);
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
      tool.execute({
        ...example.input,
        initialAreaSquareMillimeters: Number.NaN,
      }).ok,
    ).toBe(false);
  });
  it("rejects an input outside the stated model", () => {
    expect(
      tool.execute({ ...example.input, finalAreaSquareMillimeters: 101 }).ok,
    ).toBe(false);
  });
});
