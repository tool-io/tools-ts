import { describe, expect, it } from "vitest";
import { runEquilibriumKpFromKc } from "./tool.js";

describe("Kp From Kc Calculator", () => {
  it("returns Kc unchanged when Δn is zero", () => {
    expect(
      runEquilibriumKpFromKc({ deltaN: 0, kc: 4, temperatureK: 300 }),
    ).toEqual({ ok: true, output: { kp: 4 } });
  });

  it("applies the RT power for nonzero Δn", () => {
    const result = runEquilibriumKpFromKc({
      deltaN: 1,
      kc: 4,
      temperatureK: 300,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.kp).toBeCloseTo(98.472, 2);
  });

  it("rejects invalid input", () =>
    expect(runEquilibriumKpFromKc(null).ok).toBe(false));
});
