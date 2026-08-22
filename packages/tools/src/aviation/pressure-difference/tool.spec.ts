import { describe, expect, it } from "vitest";
import { pressureDifferenceExample, runPressureDifference } from "./tool.js";

describe("pressure difference calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPressureDifference(pressureDifferenceExample.input)).toEqual({
      ok: true,
      output: pressureDifferenceExample.output,
    });
  });

  it("returns zero on a standard-day QNH", () => {
    expect(runPressureDifference({ qnhHpa: 1013.25 })).toEqual({
      ok: true,
      output: { pressureDifferenceHpa: 0 },
    });
  });

  it("is positive above standard and negative below", () => {
    expect(runPressureDifference({ qnhHpa: 1043 })).toMatchObject({ ok: true });
    const high = runPressureDifference({ qnhHpa: 1043 });
    const low = runPressureDifference({ qnhHpa: 979 });
    if (!high.ok || !low.ok) throw new Error("expected success");
    expect(high.output.pressureDifferenceHpa).toBeGreaterThan(0);
    expect(low.output.pressureDifferenceHpa).toBeLessThan(0);
  });

  it("computes exact sub-unit differences", () => {
    expect(runPressureDifference({ qnhHpa: 979 })).toEqual({
      ok: true,
      output: { pressureDifferenceHpa: -34.25 },
    });
    expect(runPressureDifference({ qnhHpa: 1023 })).toEqual({
      ok: true,
      output: { pressureDifferenceHpa: 9.75 },
    });
  });

  it("is antisymmetric about the standard pressure", () => {
    const above = runPressureDifference({ qnhHpa: 1050 });
    const below = runPressureDifference({ qnhHpa: 976.5 });
    if (!above.ok || !below.ok) throw new Error("expected success");
    expect(above.output.pressureDifferenceHpa).toBeCloseTo(36.75, 9);
    expect(below.output.pressureDifferenceHpa).toBeCloseTo(-36.75, 9);
  });

  it("accepts the extreme QNH bounds of the schema", () => {
    expect(runPressureDifference({ qnhHpa: 300 })).toMatchObject({
      ok: true,
    });
    expect(runPressureDifference({ qnhHpa: 1100 })).toMatchObject({
      ok: true,
    });
  });

  it("rejects pressures outside the plausible atmosphere range", () => {
    expect(runPressureDifference({ qnhHpa: 299 })).toMatchObject({
      ok: false,
    });
    expect(runPressureDifference({ qnhHpa: 1100.5 })).toMatchObject({
      ok: false,
    });
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runPressureDifference({})).toMatchObject({ ok: false });
    expect(runPressureDifference({ qnhHpa: "stormy" })).toMatchObject({
      ok: false,
    });
  });
});
