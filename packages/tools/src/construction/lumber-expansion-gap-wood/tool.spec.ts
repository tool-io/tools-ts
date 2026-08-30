import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLumberExpansionGapWood, example } from "./tool.js";

describe("construction/lumber-expansion-gap-wood", () => {
  it("matches its worked example", () => {
    expect(calculateLumberExpansionGapWood(example.input)).toEqual(
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
  it("rejects a negative widthMillimeters", () => {
    expect(tool.execute({ ...example.input, widthMillimeters: -1 }).ok).toBe(
      false,
    );
  });
});
