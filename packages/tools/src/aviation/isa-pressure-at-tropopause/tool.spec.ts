import { describe, expect, it } from "vitest";
import {
  isaPressureAtTropopauseExample,
  runIsaPressureAtTropopause,
} from "./tool.js";

describe("isa pressure at tropopause calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIsaPressureAtTropopause(isaPressureAtTropopauseExample.input),
    ).toEqual({
      ok: true,
      output: isaPressureAtTropopauseExample.output,
    });
  });

  it("is continuous at the tropopause within a hundredth of a hectopascal", () => {
    const result = runIsaPressureAtTropopause({ altitudeMeters: 11000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.pressureHpa).toBeCloseTo(226.321, 2);
  });

  it("decays exponentially in the lower stratosphere", () => {
    const result = runIsaPressureAtTropopause({ altitudeMeters: 15000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.pressureHpa).toBeCloseTo(120.44590000468754, 9);
  });

  it("reaches roughly five percent of sea level at twenty kilometers", () => {
    const result = runIsaPressureAtTropopause({ altitudeMeters: 20000 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.pressureHpa).toBeCloseTo(54.74897349071286, 9);
    expect(result.output.pressureHpa).toBeLessThan(1013.25 / 10);
  });

  it("decreases strictly with altitude", () => {
    const samples = [0, 2500, 5000, 7500, 10000, 13000, 16000, 19000];
    for (let i = 1; i < samples.length; i++) {
      const lower = runIsaPressureAtTropopause({
        altitudeMeters: samples[i - 1]!,
      });
      const upper = runIsaPressureAtTropopause({
        altitudeMeters: samples[i]!,
      });
      if (!lower.ok || !upper.ok) throw new Error("expected success");
      expect(Number(upper.output.pressureHpa)).toBeLessThan(
        Number(lower.output.pressureHpa),
      );
    }
  });

  it("matches a known mid-troposphere value", () => {
    const result = runIsaPressureAtTropopause({ altitudeMeters: 2500 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.pressureHpa).toBeCloseTo(746.8251228281349, 9);
  });

  it("accepts the full zero to twenty kilometer range", () => {
    for (const altitudeMeters of [0, 11000, 20000]) {
      expect(runIsaPressureAtTropopause({ altitudeMeters })).toMatchObject({
        ok: true,
      });
    }
  });

  it("rejects altitudes outside the model range", () => {
    expect(runIsaPressureAtTropopause({ altitudeMeters: -1 })).toMatchObject({
      ok: false,
    });
    expect(runIsaPressureAtTropopause({ altitudeMeters: 20001 })).toMatchObject(
      { ok: false },
    );
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runIsaPressureAtTropopause({})).toMatchObject({ ok: false });
    expect(
      runIsaPressureAtTropopause({ altitudeMeters: "high" }),
    ).toMatchObject({ ok: false });
  });
});
