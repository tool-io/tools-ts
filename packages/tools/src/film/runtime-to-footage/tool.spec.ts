import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRuntimeToFootage, example } from "./tool.js";

describe("film/runtime-to-footage", () => {
  it("matches its worked example", () => {
    expect(calculateRuntimeToFootage(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, runtimeMinutes: Number.NaN }).ok,
    ).toBe(false);
  });
});
