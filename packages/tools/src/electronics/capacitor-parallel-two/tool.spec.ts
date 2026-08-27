import { describe, expect, it } from "vitest";
import { runCapacitorParallelTwo } from "./tool.js";
describe("Parallel Capacitors", () => {
  it("calculates a valid result", () => {
    const result = runCapacitorParallelTwo({ c1F: 0.000002, c2F: 0.000003 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.totalCapacitanceF).toBeCloseTo(0.000005, 15);
  });
  it("sums unequal capacitances", () => {
    const result = runCapacitorParallelTwo({ c1F: 0.000001, c2F: 0.000002 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.totalCapacitanceF).toBeCloseTo(3e-6, 15);
  });
  it("allows zero capacitances", () =>
    expect(runCapacitorParallelTwo({ c1F: 0, c2F: 0 })).toEqual({
      ok: true,
      output: { totalCapacitanceF: 0 },
    }));
  it("rejects non-finite input", () =>
    expect(runCapacitorParallelTwo({ c1F: Number.NaN, c2F: 1 }).ok).toBe(
      false,
    ));
  it("rejects an unknown field", () => {
    const result = runCapacitorParallelTwo({ c1F: 1, c2F: 2, extra: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runCapacitorParallelTwo({ c2F: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runCapacitorParallelTwo({ c1F: 1, c2F: "2" }).ok).toBe(false));
});
