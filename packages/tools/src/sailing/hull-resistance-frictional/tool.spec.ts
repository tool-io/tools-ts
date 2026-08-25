import { describe, expect, it } from "vitest";
import {
  hullResistanceFrictionalExample,
  runHullResistanceFrictional,
} from "./tool.js";

describe("Frictional Resistance", () => {
  it("calculates the canonical example with the default coefficient", () =>
    expect(
      runHullResistanceFrictional(hullResistanceFrictionalExample.input),
    ).toEqual({ ok: true, output: hullResistanceFrictionalExample.output }));
  it("quadruples resistance when speed doubles", () => {
    const slow = runHullResistanceFrictional({
      speedMs: 1,
      wettedAreaM2: 20,
    });
    if (!slow.ok) throw new Error("Expected success.");
    expect(slow.output.frictionalResistanceNewtons).toBe(41);
    expect(
      hullResistanceFrictionalExample.output.frictionalResistanceNewtons,
    ).toBe(Number(slow.output.frictionalResistanceNewtons) * 4);
  });
  it("scales linearly with wetted area", () =>
    expect(
      runHullResistanceFrictional({ speedMs: 2, wettedAreaM2: 10 }),
    ).toEqual({ ok: true, output: { frictionalResistanceNewtons: 82 } }));
  it("honours a custom friction coefficient", () =>
    expect(
      runHullResistanceFrictional({
        frictionCoefficient: 0.002,
        speedMs: 2,
        wettedAreaM2: 20,
      }),
    ).toEqual({ ok: true, output: { frictionalResistanceNewtons: 82 } }));
  it("accepts the lower coefficient bound", () =>
    expect(
      runHullResistanceFrictional({
        frictionCoefficient: 0.001,
        speedMs: 2,
        wettedAreaM2: 20,
      }),
    ).toEqual({ ok: true, output: { frictionalResistanceNewtons: 41 } }));
  it("accepts the upper coefficient bound", () =>
    expect(
      runHullResistanceFrictional({
        frictionCoefficient: 0.01,
        speedMs: 2,
        wettedAreaM2: 20,
      }),
    ).toEqual({ ok: true, output: { frictionalResistanceNewtons: 410 } }));
  it("rejects coefficients outside 0.001 to 0.01", () => {
    expect(
      runHullResistanceFrictional({
        frictionCoefficient: 0.0009,
        speedMs: 2,
        wettedAreaM2: 20,
      }).ok,
    ).toBe(false);
    expect(
      runHullResistanceFrictional({
        frictionCoefficient: 0.0101,
        speedMs: 2,
        wettedAreaM2: 20,
      }).ok,
    ).toBe(false);
  });
  it("returns zero at rest or with no wetted area", () => {
    const zeroSpeed = runHullResistanceFrictional({
      speedMs: 0,
      wettedAreaM2: 20,
    });
    expect(zeroSpeed).toEqual({
      ok: true,
      output: { frictionalResistanceNewtons: 0 },
    });
    const zeroArea = runHullResistanceFrictional({
      speedMs: 2,
      wettedAreaM2: 0,
    });
    expect(zeroArea).toEqual({
      ok: true,
      output: { frictionalResistanceNewtons: 0 },
    });
  });
  it("rejects negative, missing and malformed input", () => {
    expect(
      runHullResistanceFrictional({ speedMs: -2, wettedAreaM2: 20 }).ok,
    ).toBe(false);
    expect(runHullResistanceFrictional({}).ok).toBe(false);
    expect(
      runHullResistanceFrictional({ speedMs: "2", wettedAreaM2: 20 }).ok,
    ).toBe(false);
    expect(runHullResistanceFrictional(null).ok).toBe(false);
  });
});
