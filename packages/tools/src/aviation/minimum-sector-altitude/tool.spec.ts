import { describe, expect, it } from "vitest";
import {
  minimumSectorAltitudeExample,
  runMinimumSectorAltitude,
} from "./tool.js";

describe("minimum sector altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMinimumSectorAltitude(minimumSectorAltitudeExample.input),
    ).toEqual({
      ok: true,
      output: minimumSectorAltitudeExample.output,
    });
  });

  it("rounds a partial hundred up before adding clearance", () => {
    expect(runMinimumSectorAltitude({ highestObstacleFt: 5050 })).toEqual({
      ok: true,
      output: { minimumSectorAltitudeFt: 6100 },
    });
  });

  it("does not round exact multiples of one hundred", () => {
    expect(runMinimumSectorAltitude({ highestObstacleFt: 8000 })).toEqual({
      ok: true,
      output: { minimumSectorAltitudeFt: 9000 },
    });
  });

  it("adds exactly one thousand feet of clearance", () => {
    const result = runMinimumSectorAltitude({ highestObstacleFt: 2347 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.minimumSectorAltitudeFt).toBe(3400);
  });

  it("handles sea-level and near-zero obstacles", () => {
    expect(runMinimumSectorAltitude({ highestObstacleFt: 0 })).toEqual({
      ok: true,
      output: { minimumSectorAltitudeFt: 1000 },
    });
    expect(runMinimumSectorAltitude({ highestObstacleFt: 99 })).toEqual({
      ok: true,
      output: { minimumSectorAltitudeFt: 1100 },
    });
  });

  it("grows in hundred-foot steps with the obstacle", () => {
    const low = runMinimumSectorAltitude({ highestObstacleFt: 1000 });
    const high = runMinimumSectorAltitude({ highestObstacleFt: 1099 });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(low.output.minimumSectorAltitudeFt).toBe(2000);
    expect(high.output.minimumSectorAltitudeFt).toBe(2100);
  });

  it("rejects negative obstacles at the schema boundary", () => {
    expect(runMinimumSectorAltitude({ highestObstacleFt: -1 })).toMatchObject({
      ok: false,
    });
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runMinimumSectorAltitude({})).toMatchObject({ ok: false });
    expect(
      runMinimumSectorAltitude({ highestObstacleFt: "high" }),
    ).toMatchObject({ ok: false });
  });
});
