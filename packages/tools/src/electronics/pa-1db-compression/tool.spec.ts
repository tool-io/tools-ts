import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePa1dbCompression, example } from "./tool.js";

describe("electronics/pa-1db-compression", () => {
  it("matches its worked example", () => {
    expect(calculatePa1dbCompression(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, compressedOutputDbm: Number.NaN }).ok,
    ).toBe(false);
  });
});
