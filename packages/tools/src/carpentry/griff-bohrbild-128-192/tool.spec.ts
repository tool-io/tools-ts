import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateGriffBohrbild128192, example } from "./tool.js";

describe("carpentry/griff-bohrbild-128-192", () => {
  it("matches its worked example", () => {
    expect(calculateGriffBohrbild128192(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, centerMillimeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative centerMillimeters", () => {
    expect(tool.execute({ ...example.input, centerMillimeters: -1 }).ok).toBe(
      false,
    );
  });
  it("rejects hole positions before the zero datum", () => {
    expect(tool.execute({ ...example.input, centerMillimeters: 50 }).ok).toBe(
      false,
    );
  });
});
