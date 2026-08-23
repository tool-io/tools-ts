import { describe, expect, it } from "vitest";
import { runFieldElevationQnh } from "./tool.js";
describe("Pressure Altitude From QNH Calculator", () => {
  it("raises pressure altitude for low QNH", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: 2000, qnhHpa: 993.25 }),
    ).toEqual({ ok: true, output: { pressureAltitudeFt: 2540 } }));
  it("lowers pressure altitude for high QNH", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: 2000, qnhHpa: 1033.25 }),
    ).toEqual({ ok: true, output: { pressureAltitudeFt: 1460 } }));
  it("keeps the altitude at standard QNH", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: 2000, qnhHpa: 1013.25 }),
    ).toEqual({ ok: true, output: { pressureAltitudeFt: 2000 } }));
  it("supports negative indicated altitudes", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: -100, qnhHpa: 1013.25 }),
    ).toEqual({ ok: true, output: { pressureAltitudeFt: -100 } }));
  it("handles fractional QNH", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: 0, qnhHpa: 990 }),
    ).toEqual({ ok: true, output: { pressureAltitudeFt: 627.75 } }));
  it("rejects QNH below the bound", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: 0, qnhHpa: 299 }).ok,
    ).toBe(false));
  it("rejects QNH above the bound", () =>
    expect(
      runFieldElevationQnh({ indicatedAltitudeFt: 0, qnhHpa: 1101 }).ok,
    ).toBe(false));
  it("rejects non-finite altitude", () =>
    expect(
      runFieldElevationQnh({
        indicatedAltitudeFt: Number.NaN,
        qnhHpa: 1013.25,
      }).ok,
    ).toBe(false));
});
