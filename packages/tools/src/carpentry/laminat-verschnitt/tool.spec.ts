import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLaminatVerschnitt, example } from "./tool.js";

describe("carpentry/laminat-verschnitt", () => {
  it("matches its worked example", () => {
    expect(calculateLaminatVerschnitt(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, purchasedSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative purchasedSquareMeters", () => {
    expect(
      tool.execute({ ...example.input, purchasedSquareMeters: -1 }).ok,
    ).toBe(false);
  });
});
