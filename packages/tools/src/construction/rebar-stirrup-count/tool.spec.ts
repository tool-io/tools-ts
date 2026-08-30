import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRebarStirrupCount, example } from "./tool.js";

describe("construction/rebar-stirrup-count", () => {
  it("matches its worked example", () => {
    expect(calculateRebarStirrupCount(example.input)).toEqual(example.output);
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
