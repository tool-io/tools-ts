import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePcbTraceLengthFromDelay, example } from "./tool.js";

describe("electronics/pcb-trace-length-from-delay", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePcbTraceLengthFromDelay(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, propagationDelaySeconds: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ propagationDelaySeconds: 1e308, effectivePermittivity: 1e308 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.traceLengthMeters / 2.9979245800000003e162,
      ).toBeCloseTo(1, 8);
  });
  it("rejects an invalid domain combination", () => {
    const result = tool.execute({
      propagationDelaySeconds: 1e-9,
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
