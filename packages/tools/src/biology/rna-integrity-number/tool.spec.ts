import { describe, expect, it } from "vitest";
import { runRnaIntegrityNumber } from "./tool.js";

describe("RIN Proxy", () => {
  it("scores a two to one ratio of intact ribosomal RNA", () =>
    expect(runRnaIntegrityNumber({ area18s: 100, area28s: 200 })).toEqual({
      ok: true,
      output: { integrityProxy: 6.666666666666666 },
    }));
  it("scores balanced peaks as mid range", () =>
    expect(runRnaIntegrityNumber({ area18s: 50, area28s: 50 })).toEqual({
      ok: true,
      output: { integrityProxy: 5 },
    }));
  it("scores a degraded sample near the bottom of the scale", () =>
    expect(runRnaIntegrityNumber({ area18s: 75, area28s: 25 })).toEqual({
      ok: true,
      output: { integrityProxy: 2.5 },
    }));
  it("scores high quality RNA near the top of the scale", () =>
    expect(runRnaIntegrityNumber({ area18s: 50, area28s: 400 })).toEqual({
      ok: true,
      output: { integrityProxy: 8.88888888888889 },
    }));
  it("rejects a zero 28S area", () => {
    const result = runRnaIntegrityNumber({ area18s: 100, area28s: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_areas");
  });
  it("rejects a zero 18S area", () => {
    const result = runRnaIntegrityNumber({ area18s: 0, area28s: 200 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_areas");
  });
  it("rejects negative areas", () => {
    const result = runRnaIntegrityNumber({ area18s: -5, area28s: 200 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_areas");
  });
});
