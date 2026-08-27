import { describe, expect, it } from "vitest";
import {
  refractoryPeriodRelativeExample,
  runRefractoryPeriodRelative,
} from "./tool.js";

describe("Relative Refractory Period", () => {
  it("publishes an executable example", () =>
    expect(
      runRefractoryPeriodRelative(refractoryPeriodRelativeExample.input),
    ).toEqual({
      ok: true,
      output: refractoryPeriodRelativeExample.output,
    }));
  it("clamps to full recovery late in the window", () =>
    expect(runRefractoryPeriodRelative({ elapsedMs: 100 })).toEqual({
      ok: true,
      output: { recoveryFraction: 1 },
    }));
  it("is zero during the absolute phase", () =>
    expect(runRefractoryPeriodRelative({ elapsedMs: 0 })).toEqual({
      ok: true,
      output: { recoveryFraction: 0 },
    }));
  it("starts recovering at the absolute boundary", () =>
    expect(runRefractoryPeriodRelative({ elapsedMs: 1 })).toEqual({
      ok: true,
      output: { recoveryFraction: 0 },
    }));
  it("scales linearly with a custom window", () =>
    expect(
      runRefractoryPeriodRelative({
        absoluteRefractoryMs: 1,
        elapsedMs: 2.5,
        relativeWindowMs: 5,
      }),
    ).toEqual({ ok: true, output: { recoveryFraction: 0.3 } }));
  it("caps overshoot at one", () =>
    expect(
      runRefractoryPeriodRelative({
        absoluteRefractoryMs: 1,
        elapsedMs: 5,
        relativeWindowMs: 3,
      }),
    ).toEqual({ ok: true, output: { recoveryFraction: 1 } }));
  it("rejects a zero window", () => {
    const result = runRefractoryPeriodRelative({
      elapsedMs: 2.5,
      relativeWindowMs: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_window");
  });
  it("rejects a fifty millisecond window", () =>
    expect(
      runRefractoryPeriodRelative({
        elapsedMs: 2.5,
        relativeWindowMs: 50,
      }).ok,
    ).toBe(false));
  it("rejects negative elapsed time", () =>
    expect(runRefractoryPeriodRelative({ elapsedMs: -1 }).ok).toBe(false));
});
