import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePointsToPixels96dpi, example } from "./tool.js";

describe("typography/points-to-pixels-96dpi", () => {
  it("matches its worked example", () => {
    expect(calculatePointsToPixels96dpi(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("maps 72 CSS points to 96 CSS pixels", () => {
    expect(tool.execute({ points: 72 })).toEqual({
      ok: true,
      output: { pixels: 96 },
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, points: Number.NaN }).ok).toBe(
      false,
    );
  });
});
