import { describe, expect, it } from "vitest";
import {
  volcanicExplosivityIndexCalculatorExample,
  runVolcanicExplosivityIndexCalculator,
} from "./tool.js";

describe("volcanic-explosivity-index-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVolcanicExplosivityIndexCalculator(
        volcanicExplosivityIndexCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: volcanicExplosivityIndexCalculatorExample.output,
    });
  });

  it("caps at VEI 8 for volumes beyond 10^12", () => {
    const result = runVolcanicExplosivityIndexCalculator({
      bulkVolumeCubicMeters: 1e15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.vei).toBe(8);
  });
  it("uses the special low-volume VEI thresholds", () => {
    expect(
      runVolcanicExplosivityIndexCalculator({ bulkVolumeCubicMeters: 9_999 }),
    ).toEqual({
      ok: true,
      output: { classification: "non-explosive", vei: 0 },
    });
    expect(
      runVolcanicExplosivityIndexCalculator({ bulkVolumeCubicMeters: 10_000 }),
    ).toEqual({
      ok: true,
      output: { classification: "gentle", vei: 1 },
    });
    expect(
      runVolcanicExplosivityIndexCalculator({
        bulkVolumeCubicMeters: 1_000_000,
      }),
    ).toEqual({
      ok: true,
      output: { classification: "explosive", vei: 2 },
    });
  });
  it("rejects non-positive volumes", () => {
    expect(
      runVolcanicExplosivityIndexCalculator({ bulkVolumeCubicMeters: 0 }).ok,
    ).toBe(false);
  });
});
