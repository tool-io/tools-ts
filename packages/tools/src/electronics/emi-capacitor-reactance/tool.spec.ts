import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateEmiCapacitorReactance, example } from "./tool.js";

describe("electronics/emi-capacitor-reactance", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateEmiCapacitorReactance(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, frequencyHz: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ frequencyHz: 1e308, capacitanceFarads: 1e-308 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.reactanceOhms / 0.15915494309189535).toBeCloseTo(
        1,
        8,
      );
  });
});
