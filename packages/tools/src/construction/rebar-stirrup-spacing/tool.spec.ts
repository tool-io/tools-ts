import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRebarStirrupSpacing, example } from "./tool.js";

describe("construction/rebar-stirrup-spacing", () => {
  it("matches its worked example", () => {
    expect(calculateRebarStirrupSpacing(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, cageLengthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative cageLengthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, cageLengthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
