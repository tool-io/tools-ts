import { describe, expect, it } from "vitest";
import { quantumYieldExample, runQuantumYield } from "./tool.js";
describe("Quantum Yield Calculator", () => {
  it("publishes an executable example", () =>
    expect(runQuantumYield(quantumYieldExample.input)).toEqual({
      ok: true,
      output: quantumYieldExample.output,
    }));
  it("returns unity when every absorbed photon is emitted", () =>
    expect(
      runQuantumYield({ photonsEmitted: 10, photonsAbsorbed: 10 }),
    ).toEqual({ ok: true, output: { quantumYield: 1 } }));
  it("returns zero when no photons are emitted", () =>
    expect(runQuantumYield({ photonsEmitted: 0, photonsAbsorbed: 10 })).toEqual(
      { ok: true, output: { quantumYield: 0 } },
    ));
  it("matches a rhodamine-like yield closely", () => {
    const result = runQuantumYield({
      photonsEmitted: 95,
      photonsAbsorbed: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.quantumYield).toBeCloseTo(0.95, 12);
  });
  it("rejects emission above absorption", () =>
    expect(
      runQuantumYield({ photonsEmitted: 11, photonsAbsorbed: 10 }).ok,
    ).toBe(false));
  it("rejects negative emitted counts", () =>
    expect(
      runQuantumYield({ photonsEmitted: -1, photonsAbsorbed: 10 }).ok,
    ).toBe(false));
  it("rejects zero absorbed photons", () =>
    expect(runQuantumYield({ photonsEmitted: 5, photonsAbsorbed: 0 }).ok).toBe(
      false,
    ));
  it("rejects fractional photon counts", () =>
    expect(
      runQuantumYield({ photonsEmitted: 2.5, photonsAbsorbed: 10 }).ok,
    ).toBe(false));
});
