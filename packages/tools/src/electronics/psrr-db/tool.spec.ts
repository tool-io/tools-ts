import { describe, expect, it } from "vitest";
import { runPsrrDb } from "./tool.js";

describe("PSRR dB", () => {
  it("calculates a valid result", () =>
    expect(runPsrrDb({ deltaSupplyV: 0.1, deltaOutputV: 0.00001 })).toEqual({
      ok: true,
      output: { psrrDb: 80 },
    }));
  it("returns zero for equal deltas", () =>
    expect(runPsrrDb({ deltaSupplyV: 0.05, deltaOutputV: 0.05 })).toEqual({
      ok: true,
      output: { psrrDb: 0 },
    }));
  it("returns negative decibels when output ripple dominates", () =>
    expect(runPsrrDb({ deltaSupplyV: 0.01, deltaOutputV: 0.1 })).toEqual({
      ok: true,
      output: { psrrDb: -20 },
    }));
  it("rejects zero supply change", () =>
    expect(runPsrrDb({ deltaSupplyV: 0, deltaOutputV: 0.1 }).ok).toBe(false));
  it("rejects negative supply change", () =>
    expect(runPsrrDb({ deltaSupplyV: -0.1, deltaOutputV: 0.00001 }).ok).toBe(
      false,
    ));
  it("rejects zero output change", () =>
    expect(runPsrrDb({ deltaSupplyV: 0.1, deltaOutputV: 0 }).ok).toBe(false));
  it("rejects negative output change", () =>
    expect(runPsrrDb({ deltaSupplyV: 0.1, deltaOutputV: -0.00001 }).ok).toBe(
      false,
    ));
});
