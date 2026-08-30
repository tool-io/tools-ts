import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFederNutMasse13Regel, example } from "./tool.js";

describe("carpentry/feder-nut-masse-1-3-regel", () => {
  it("matches its worked example", () => {
    expect(calculateFederNutMasse13Regel(example.input)).toEqual(
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
      tool.execute({ ...example.input, stockThicknessMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative stockThicknessMillimeters", () => {
    expect(
      tool.execute({ ...example.input, stockThicknessMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
