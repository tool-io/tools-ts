import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateLedViewingAngleIntensity, example } from "./tool.js";

describe("electronics/led-viewing-angle-intensity", () => {
  it("matches its worked example", () => {
    expect(calculateLedViewingAngleIntensity(example.input)).toEqual(
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
      tool.execute({ ...example.input, onAxisCandela: Number.NaN }).ok,
    ).toBe(false);
  });
  it("requires a nonzero half-intensity angle", () => {
    expect(tool.execute({ ...example.input, halfIntensityDegrees: 0 }).ok).toBe(
      false,
    );
  });
});
