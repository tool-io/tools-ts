import { describe, expect, it } from "vitest";
import { planingPassDepthExample, runPlaningPassDepth } from "./tool.js";

describe("Planing Pass Depth Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPlaningPassDepth(planingPassDepthExample.input)).toEqual({
      ok: true,
      output: planingPassDepthExample.output,
    }));

  it("takes the full depth in a single pass", () =>
    expect(runPlaningPassDepth({ passCount: 1, totalDepthMm: 3 })).toEqual({
      ok: true,
      output: { perPassMillimeters: 3 },
    }));

  it("produces a repeating decimal for uneven division", () =>
    expect(runPlaningPassDepth({ passCount: 3, totalDepthMm: 1 })).toEqual({
      ok: true,
      output: { perPassMillimeters: 0.3333333333333333 },
    }));

  it("handles fractional total depths", () =>
    expect(runPlaningPassDepth({ passCount: 2, totalDepthMm: 0.5 })).toEqual({
      ok: true,
      output: { perPassMillimeters: 0.25 },
    }));

  it("supports many light passes", () =>
    expect(runPlaningPassDepth({ passCount: 40, totalDepthMm: 10 })).toEqual({
      ok: true,
      output: { perPassMillimeters: 0.25 },
    }));

  it("accepts the minimum pass count of one", () =>
    expect(runPlaningPassDepth({ passCount: 1, totalDepthMm: 0.1 })).toEqual({
      ok: true,
      output: { perPassMillimeters: 0.1 },
    }));

  it("rejects a zero or negative total depth", () => {
    for (const totalDepthMm of [0, -2]) {
      const result = runPlaningPassDepth({ passCount: 4, totalDepthMm });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_total_depth");
    }
  });

  it("rejects a zero pass count", () => {
    const result = runPlaningPassDepth({ passCount: 0, totalDepthMm: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects negative or fractional pass counts", () => {
    for (const passCount of [-4, 2.5]) {
      const result = runPlaningPassDepth({ passCount, totalDepthMm: 2 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_input");
    }
  });

  it("rejects non-finite input", () =>
    expect(
      runPlaningPassDepth({ passCount: 4, totalDepthMm: Number.NaN }).ok,
    ).toBe(false));

  it("rejects missing inputs", () => {
    const result = runPlaningPassDepth({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () =>
    expect(
      runPlaningPassDepth({ passCount: 4, totalDepthMm: 2, extra: 1 } as never)
        .ok,
    ).toBe(false));
});
