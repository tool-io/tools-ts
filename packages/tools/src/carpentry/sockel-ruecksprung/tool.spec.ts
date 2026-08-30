import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSockelRuecksprung, example } from "./tool.js";

describe("carpentry/sockel-ruecksprung", () => {
  it("matches its worked example", () => {
    expect(calculateSockelRuecksprung(example.input)).toEqual(example.output);
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
      tool.execute({ ...example.input, cabinetFrontMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative cabinetFrontMillimeters", () => {
    expect(
      tool.execute({ ...example.input, cabinetFrontMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
