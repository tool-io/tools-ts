import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateScrewLengthRule, example } from "./tool.js";

describe("carpentry/screw-length-rule", () => {
  it("matches its worked example", () => {
    expect(calculateScrewLengthRule(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, firstMemberMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative firstMemberMillimeters", () => {
    expect(
      tool.execute({ ...example.input, firstMemberMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
