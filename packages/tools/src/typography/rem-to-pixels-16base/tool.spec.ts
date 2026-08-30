import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRemToPixels16base, example } from "./tool.js";

describe("typography/rem-to-pixels-16base", () => {
  it("matches its worked example", () => {
    expect(calculateRemToPixels16base(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, rem: Number.NaN }).ok).toBe(false);
  });
});
