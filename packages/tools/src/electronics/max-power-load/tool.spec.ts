import { describe, expect, it } from "vitest";
import { runMaxPowerLoad } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runMaxPowerLoad>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};

describe("Max Power Load", () => {
  it("matches a 50 ohm source", () =>
    expect(runMaxPowerLoad({ sourceResistanceOhms: 50 })).toEqual({
      ok: true,
      output: { loadForMaxPowerOhms: 50 },
    }));
  it("matches an audio-grade 600 ohm source", () =>
    expect(runMaxPowerLoad({ sourceResistanceOhms: 600 })).toEqual({
      ok: true,
      output: { loadForMaxPowerOhms: 600 },
    }));
  it("preserves fractional source resistances exactly", () =>
    expect(runMaxPowerLoad({ sourceResistanceOhms: 12345.678 })).toEqual({
      ok: true,
      output: { loadForMaxPowerOhms: 12345.678 },
    }));
  it("accepts very small positive source resistances", () =>
    expect(runMaxPowerLoad({ sourceResistanceOhms: 1e-9 })).toEqual({
      ok: true,
      output: { loadForMaxPowerOhms: 1e-9 },
    }));
  it("rejects a zero source resistance", () => {
    const result = runMaxPowerLoad({ sourceResistanceOhms: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative source resistance", () =>
    expect(runMaxPowerLoad({ sourceResistanceOhms: -50 }).ok).toBe(false));
  it("rejects a large negative source resistance", () =>
    expect(runMaxPowerLoad({ sourceResistanceOhms: -1e6 }).ok).toBe(false));
});
