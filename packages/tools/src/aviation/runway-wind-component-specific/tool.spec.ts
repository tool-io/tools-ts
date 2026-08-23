import { describe, expect, it } from "vitest";
import {
  runwayWindComponentSpecificExample,
  runRunwayWindComponentSpecific,
} from "./tool.js";

describe("runway wind components", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRunwayWindComponentSpecific(runwayWindComponentSpecificExample.input),
    ).toEqual({
      ok: true,
      output: runwayWindComponentSpecificExample.output,
    });
  });

  it("reports full headwind when the wind is aligned with the runway", () => {
    const result = runRunwayWindComponentSpecific({
      runwayHeadingDeg: 270,
      windFromDeg: 270,
      windSpeedKt: 15,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.headwindComponentKt).toBe(15);
    expect(result.output.crosswindComponentKt).toBeCloseTo(0, 9);
  });

  it("reports a negative headwind for wind from behind", () => {
    const result = runRunwayWindComponentSpecific({
      runwayHeadingDeg: 90,
      windFromDeg: 270,
      windSpeedKt: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.headwindComponentKt).toBe(-12);
  });

  it("signs a right crosswind as positive", () => {
    const result = runRunwayWindComponentSpecific({
      runwayHeadingDeg: 0,
      windFromDeg: 90,
      windSpeedKt: 25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.headwindComponentKt).toBeCloseTo(0, 9);
    expect(result.output.crosswindComponentKt).toBeCloseTo(25, 9);
  });

  it("preserves the total wind magnitude", () => {
    const result = runRunwayWindComponentSpecific({
      runwayHeadingDeg: 180,
      windFromDeg: 225,
      windSpeedKt: 18,
    });
    if (!result.ok) throw new Error("expected success");
    const magnitude = Math.hypot(
      Number(result.output.headwindComponentKt),
      Number(result.output.crosswindComponentKt),
    );
    expect(magnitude).toBeCloseTo(18, 9);
  });

  it("accepts headings at the three hundred sixty degree boundary", () => {
    for (const input of [
      { runwayHeadingDeg: 360, windFromDeg: 10, windSpeedKt: 8 },
      { runwayHeadingDeg: 10, windFromDeg: 360, windSpeedKt: 8 },
    ])
      expect(runRunwayWindComponentSpecific(input).ok).toBe(true);
  });

  it("rejects runway headings above three hundred sixty degrees through validation", () => {
    expect(
      runRunwayWindComponentSpecific({
        runwayHeadingDeg: 361,
        windFromDeg: 90,
        windSpeedKt: 10,
      }).ok,
    ).toBe(false);
  });

  it("rejects wind origins above three hundred sixty degrees through validation", () => {
    expect(
      runRunwayWindComponentSpecific({
        runwayHeadingDeg: 90,
        windFromDeg: 400,
        windSpeedKt: 10,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative wind speeds through validation", () => {
    expect(
      runRunwayWindComponentSpecific({
        runwayHeadingDeg: 90,
        windFromDeg: 120,
        windSpeedKt: -4,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { runwayHeadingDeg: Number.NaN, windFromDeg: 120, windSpeedKt: 20 },
      { runwayHeadingDeg: 90, windFromDeg: Number.NaN, windSpeedKt: 20 },
      { runwayHeadingDeg: 90, windFromDeg: 120, windSpeedKt: Number.NaN },
    ])
      expect(runRunwayWindComponentSpecific(bad).ok).toBe(false);
  });
});
