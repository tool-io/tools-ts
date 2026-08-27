import { describe, expect, it } from "vitest";
import { runSynapticDelay } from "./tool.js";

describe("Synaptic Delay Estimate", () => {
  it("calculates a valid result with the default base delay", () =>
    expect(runSynapticDelay({ distanceUm: 100 })).toEqual({
      ok: true,
      output: { synapticDelayMs: 2.5 },
    }));
  it("adds 0.02 milliseconds per micrometre", () => {
    const result = runSynapticDelay({ distanceUm: 250 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.synapticDelayMs).toBe(5.5);
  });
  it("honours an explicit base delay", () =>
    expect(runSynapticDelay({ baseDelayMs: 1, distanceUm: 50 })).toEqual({
      ok: true,
      output: { synapticDelayMs: 2 },
    }));
  it("returns the base delay alone at zero distance", () =>
    expect(runSynapticDelay({ distanceUm: 0 })).toEqual({
      ok: true,
      output: { synapticDelayMs: 0.5 },
    }));
  it("accepts the maximum allowed base delay", () =>
    expect(runSynapticDelay({ baseDelayMs: 5, distanceUm: 0 })).toEqual({
      ok: true,
      output: { synapticDelayMs: 5 },
    }));
  it("rejects negative distances", () =>
    expect(runSynapticDelay({ distanceUm: -10 }).ok).toBe(false));
  it("rejects base delays above five milliseconds", () =>
    expect(runSynapticDelay({ baseDelayMs: 5.5, distanceUm: 10 }).ok).toBe(
      false,
    ));
  it("rejects negative base delays", () =>
    expect(runSynapticDelay({ baseDelayMs: -0.5, distanceUm: 10 }).ok).toBe(
      false,
    ));
});
