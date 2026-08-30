import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAspectRatioCalculation, example } from "./tool.js";

describe("film/aspect-ratio-calculation", () => {
  it("matches its worked example", () => {
    expect(calculateAspectRatioCalculation(example.input)).toEqual(
      example.output,
    );
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
      tool.execute({ ...example.input, widthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
