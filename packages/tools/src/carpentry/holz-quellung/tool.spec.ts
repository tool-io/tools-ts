import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHolzQuellung, example } from "./tool.js";

describe("carpentry/holz-quellung", () => {
  it("matches its worked example", () => {
    expect(calculateHolzQuellung(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, initialWidthMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative initialWidthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, initialWidthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
