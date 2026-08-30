import { describe, expect, it } from "vitest";
import {
  calculateRadioluminescentBrightness,
  radioluminescentDecayExample,
  runRadioluminescentDecay,
} from "./tool.js";

describe("radioluminescent brightness half-life calculator", () => {
  it("reproduces the canonical one-half-life example", () => {
    expect(
      runRadioluminescentDecay(radioluminescentDecayExample.input),
    ).toEqual({
      ok: true,
      output: radioluminescentDecayExample.output,
    });
  });

  it("returns full initial brightness at zero elapsed time", () => {
    expect(
      calculateRadioluminescentBrightness({
        initialBrightness: 10,
        halfLifeYears: 12.32,
        elapsedYears: 0,
      }).remainingPercent,
    ).toBe(100);
  });

  it("models one quarter after two half-lives", () => {
    expect(
      calculateRadioluminescentBrightness({
        initialBrightness: 100,
        halfLifeYears: 10,
        elapsedYears: 20,
      }).remainingPercent,
    ).toBe(25);
  });

  it("rejects a zero half-life", () => {
    expect(
      runRadioluminescentDecay({
        initialBrightness: 100,
        halfLifeYears: 0,
        elapsedYears: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "half_life_invalid", field: "halfLifeYears" }],
      },
      ok: false,
    });
  });

  it("rejects negative elapsed time", () => {
    expect(
      runRadioluminescentDecay({
        initialBrightness: 100,
        halfLifeYears: 12.32,
        elapsedYears: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "elapsedYears" }] },
      ok: false,
    });
  });
});
