import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateEmiInductorReactance, example } from "./tool.js";

describe("electronics/emi-inductor-reactance", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateEmiInductorReactance(example.input)).toEqual(
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
      ...{ frequencyHz: 1e308, inductanceHenries: 1e-308 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.reactanceOhms / 6.283185307179586).toBeCloseTo(1, 8);
  });
  it("does not lose a representable result to intermediate underflow", () => {
    const result = tool.execute({
      ...example.input,
      ...{ frequencyHz: 1e-162, inductanceHenries: 1e-162 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.reactanceOhms / 5e-324).toBeCloseTo(1, 8);
  });
});
