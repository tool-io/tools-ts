import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSheetAreaAtScaleKm2, example } from "./tool.js";

describe("cartography/sheet-area-at-scale-km2", () => {
  it("matches its worked example", () => {
    expect(calculateSheetAreaAtScaleKm2(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, widthCentimeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
