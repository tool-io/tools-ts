import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateIlluminanceUniformity, example } from "./tool.js";

describe("engineering/illuminance-uniformity", () => {
  it("matches its worked example", () => {
    expect(calculateIlluminanceUniformity(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, minimumLux: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects an input outside the stated model", () => {
    expect(tool.execute({ ...example.input, minimumLux: 501 }).ok).toBe(false);
  });
});
