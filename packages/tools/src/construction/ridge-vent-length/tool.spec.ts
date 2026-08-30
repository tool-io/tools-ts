import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRidgeVentLength, example } from "./tool.js";

describe("construction/ridge-vent-length", () => {
  it("matches its worked example", () => {
    expect(calculateRidgeVentLength(example.input)).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, ridgeMeters: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative ridgeMeters", () => {
    expect(tool.execute({ ...example.input, ridgeMeters: -1 }).ok).toBe(false);
  });
});
