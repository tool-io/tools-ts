import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePcbTracePropagationDelay, example } from "./tool.js";

describe("electronics/pcb-trace-propagation-delay", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePcbTracePropagationDelay(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, traceLengthMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ traceLengthMeters: 1e308, effectivePermittivity: 4 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.propagationDelaySeconds / 6.6712819039630414e299,
      ).toBeCloseTo(1, 8);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      traceLengthMeters: 0.3,
      effectivePermittivity: 5e-324,
    });
    expect(result).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_value", field: "effectivePermittivity" }],
      },
    });
  });
});
