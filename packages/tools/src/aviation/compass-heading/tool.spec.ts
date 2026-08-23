import { describe, expect, it } from "vitest";
import { runCompassHeading } from "./tool.js";
describe("Compass Heading Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runCompassHeading({ deviationDeg: 2, magneticHeadingDeg: 350 }),
    ).toEqual({ ok: true, output: { compassHeadingDeg: 348 } }));
  it("applies negative deviation eastward", () =>
    expect(
      runCompassHeading({ deviationDeg: -3, magneticHeadingDeg: 5 }),
    ).toEqual({ ok: true, output: { compassHeadingDeg: 8 } }));
  it("wraps below north", () =>
    expect(
      runCompassHeading({ deviationDeg: 5, magneticHeadingDeg: 1 }),
    ).toEqual({ ok: true, output: { compassHeadingDeg: 356 } }));
  it("keeps the heading unchanged without deviation", () =>
    expect(
      runCompassHeading({ deviationDeg: 0, magneticHeadingDeg: 273 }),
    ).toEqual({ ok: true, output: { compassHeadingDeg: 273 } }));
  it("handles fractional degrees", () => {
    const result = runCompassHeading({
      deviationDeg: 1.25,
      magneticHeadingDeg: 10.5,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.compassHeadingDeg).toBeCloseTo(9.25, 12);
  });
  it("rejects deviation above the bound", () =>
    expect(
      runCompassHeading({ deviationDeg: 30.1, magneticHeadingDeg: 90 }).ok,
    ).toBe(false));
  it("rejects deviation below the bound", () =>
    expect(
      runCompassHeading({ deviationDeg: -30.1, magneticHeadingDeg: 90 }).ok,
    ).toBe(false));
});
