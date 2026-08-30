import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBiscuitSlotDepth, example } from "./tool.js";

describe("carpentry/biscuit-slot-depth", () => {
  it("matches its worked example", () => {
    expect(calculateBiscuitSlotDepth(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, biscuitWidthMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative biscuitWidthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, biscuitWidthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
