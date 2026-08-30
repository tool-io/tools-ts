import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateVaractorQualityFactor, example } from "./tool.js";

describe("semiconductor/varactor-quality-factor", () => {
  it("matches its worked example", () => {
    expect(calculateVaractorQualityFactor(example.input)).toEqual(
      example.output,
    );
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
      tool.execute({ ...example.input, frequencyHertz: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative frequencyHertz", () => {
    expect(tool.execute({ ...example.input, frequencyHertz: -1 }).ok).toBe(
      false,
    );
  });
});
