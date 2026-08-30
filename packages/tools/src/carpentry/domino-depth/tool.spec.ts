import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDominoDepth, example } from "./tool.js";

describe("carpentry/domino-depth", () => {
  it("matches its worked example", () => {
    expect(calculateDominoDepth(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, tenonLengthMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative tenonLengthMillimeters", () => {
    expect(
      tool.execute({ ...example.input, tenonLengthMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
