import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHolzschraubeVorbohrung07d, example } from "./tool.js";

describe("carpentry/holzschraube-vorbohrung-07d", () => {
  it("matches its worked example", () => {
    expect(calculateHolzschraubeVorbohrung07d(example.input)).toEqual(
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
      tool.execute({ ...example.input, screwDiameterMillimeters: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative screwDiameterMillimeters", () => {
    expect(
      tool.execute({ ...example.input, screwDiameterMillimeters: -1 }).ok,
    ).toBe(false);
  });
});
