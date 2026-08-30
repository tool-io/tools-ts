import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDepthOfField, example } from "./tool.js";

describe("film/depth-of-field", () => {
  it("matches its worked example", () => {
    expect(calculateDepthOfField(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("derives finite depth from independently calculated near and far limits", () => {
    const result = calculateDepthOfField({
      focalLengthMillimeters: 50,
      fNumber: 8,
      circleOfConfusionMillimeters: 0.03,
      focusDistanceMillimeters: 2000,
    });
    const hyperfocal = 50 ** 2 / (8 * 0.03) + 50;
    const nearLimit = (hyperfocal * 2000) / (hyperfocal + 2000 - 50);
    const farLimit = (hyperfocal * 2000) / (hyperfocal - 2000 + 50);
    expect(result.depthOfFieldMillimeters).toBeCloseTo(farLimit - nearLimit, 10);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, focalLengthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
