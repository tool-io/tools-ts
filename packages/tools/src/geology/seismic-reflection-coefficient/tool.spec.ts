import { describe, expect, it } from "vitest";
import {
  seismicReflectionCoefficientExample,
  runSeismicReflectionCoefficient,
} from "./tool.js";

describe("geology/seismic-reflection-coefficient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSeismicReflectionCoefficient(
        seismicReflectionCoefficientExample.input,
      ),
    ).toEqual({ ok: true, output: seismicReflectionCoefficientExample.output });
  });

  it("is antisymmetric when the layers are swapped", () => {
    const down = runSeismicReflectionCoefficient({
      pVelocity1MPers: 2500,
      density1KgPerM3: 2200,
      pVelocity2MPers: 4000,
      density2KgPerM3: 2400,
    });
    const up = runSeismicReflectionCoefficient({
      pVelocity1MPers: 4000,
      density1KgPerM3: 2400,
      pVelocity2MPers: 2500,
      density2KgPerM3: 2200,
    });
    if (!down.ok || !up.ok) throw new Error("expected success");
    expect(
      (down.output.reflectionCoefficient as number) +
        (up.output.reflectionCoefficient as number),
    ).toBe(0);
  });

  it("rejects non-positive velocities and densities", () => {
    expect(
      runSeismicReflectionCoefficient({
        pVelocity1MPers: 0,
        density1KgPerM3: 2200,
        pVelocity2MPers: 4000,
        density2KgPerM3: 2400,
      }).ok,
    ).toBe(false);
    expect(
      runSeismicReflectionCoefficient({
        pVelocity1MPers: 2500,
        density1KgPerM3: -1,
        pVelocity2MPers: 4000,
        density2KgPerM3: 2400,
      }).ok,
    ).toBe(false);
  });
});
