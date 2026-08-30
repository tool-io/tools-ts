import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBearingLifeL10, example } from "./tool.js";

describe("engineering/bearing-life-l10", () => {
  it("matches its worked example", () => {
    expect(calculateBearingLifeL10(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, dynamicLoadRatingNewtons: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
