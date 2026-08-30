import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBiscuitSpacing, example } from "./tool.js";

describe("carpentry/biscuit-spacing", () => {
  it("matches its worked example", () => {
    expect(calculateBiscuitSpacing(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, jointLengthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("requires two or more biscuits to define spacing", () => {
    expect(tool.execute({ ...example.input, biscuitCount: 1 }).ok).toBe(false);
  });
});
