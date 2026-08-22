import { describe, expect, it } from "vitest";
import { pressureExample, runPressure } from "./tool.js";

describe("Pressure Calculator", () => {
  it("matches the canonical example", () => {
    expect(runPressure(pressureExample.input)).toEqual({
      ok: true,
      output: pressureExample.output,
    });
  });

  it("returns an exact high precision result", () => {
    expect(runPressure({ forceN: 197, areaM2: 3 })).toEqual({
      ok: true,
      output: { pressurePa: 65.66666666666667 },
    });
  });

  it("rejects zero area with a stable code", () => {
    const result = runPressure({ forceN: 100, areaM2: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "invalid_area",
        field: "areaM2",
        message: "The area must be greater than zero square metres.",
      });
  });

  it("rejects negative area with the same code", () => {
    const result = runPressure({ forceN: 100, areaM2: -4 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_area");
  });

  it("yields negative pressure for tensile force", () => {
    expect(runPressure({ forceN: -100, areaM2: 2 })).toEqual({
      ok: true,
      output: { pressurePa: -50 },
    });
  });

  it("scales inversely with area", () => {
    expect(runPressure({ forceN: 1000000, areaM2: 0.5 })).toEqual({
      ok: true,
      output: { pressurePa: 2000000 },
    });
  });

  it("rejects non object input", () =>
    expect(runPressure(undefined).ok).toBe(false));

  it("rejects unknown fields", () => {
    const result = runPressure({ forceN: 1, areaM2: 1, extra: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });

  it("rejects non finite numbers", () => {
    const result = runPressure({
      forceN: Number.POSITIVE_INFINITY,
      areaM2: 2,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = runPressure({ forceN: 100 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("areaM2");
  });
});
