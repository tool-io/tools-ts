import { describe, expect, it } from "vitest";
import { mooringLoadWindageExample, runMooringLoadWindage } from "./tool.js";

describe("mooring windage load calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMooringLoadWindage(mooringLoadWindageExample.input)).toEqual({
      ok: true,
      output: mooringLoadWindageExample.output,
    });
  });

  it("defaults to a unit drag coefficient", () => {
    expect(
      runMooringLoadWindage({ windSpeedMs: 10, windageAreaM2: 2 }),
    ).toEqual({
      ok: true,
      output: { windageLoadNewtons: 122.50000000000001 },
    });
  });

  it("accepts the 0.1 drag coefficient floor", () => {
    expect(
      runMooringLoadWindage({
        dragCoefficient: 0.1,
        windSpeedMs: 12,
        windageAreaM2: 3,
      }),
    ).toEqual({ ok: true, output: { windageLoadNewtons: 26.460000000000004 } });
  });

  it("accepts the drag coefficient ceiling of two", () => {
    expect(
      runMooringLoadWindage({
        dragCoefficient: 2,
        windSpeedMs: 12,
        windageAreaM2: 3,
      }),
    ).toEqual({ ok: true, output: { windageLoadNewtons: 529.2 } });
  });

  it("rejects drag coefficients outside 0.1 to 2", () => {
    const low = runMooringLoadWindage({
      dragCoefficient: 0.05,
      windSpeedMs: 10,
      windageAreaM2: 2,
    });
    const high = runMooringLoadWindage({
      dragCoefficient: 2.5,
      windSpeedMs: 10,
      windageAreaM2: 2,
    });
    expect(low.ok).toBe(false);
    expect(high.ok).toBe(false);
    if (!low.ok) expect(low.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects zero wind speed with the stable code", () => {
    const result = runMooringLoadWindage({
      windSpeedMs: 0,
      windageAreaM2: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_speed");
  });

  it("rejects zero windage area", () => {
    expect(
      runMooringLoadWindage({ windSpeedMs: 25, windageAreaM2: 0 }).ok,
    ).toBe(false);
  });

  it("requires the core inputs", () => {
    expect(runMooringLoadWindage({ windSpeedMs: 25 }).ok).toBe(false);
  });

  it("quadruples the load when wind speed doubles", () => {
    const base = runMooringLoadWindage({
      dragCoefficient: 1.5,
      windSpeedMs: 10,
      windageAreaM2: 5,
    });
    const doubled = runMooringLoadWindage({
      dragCoefficient: 1.5,
      windSpeedMs: 20,
      windageAreaM2: 5,
    });
    expect(base.ok).toBe(true);
    expect(doubled.ok).toBe(true);
    if (base.ok && doubled.ok)
      expect(doubled.output.windageLoadNewtons as number).toBeCloseTo(
        (base.output.windageLoadNewtons as number) * 4,
        9,
      );
  });

  it("computes a realistic gale load", () => {
    expect(
      runMooringLoadWindage({
        dragCoefficient: 1.1,
        windSpeedMs: 30,
        windageAreaM2: 12,
      }),
    ).toEqual({
      ok: true,
      output: { windageLoadNewtons: 7276.500000000001 },
    });
  });
});
