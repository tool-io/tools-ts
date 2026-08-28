import { describe, expect, it } from "vitest";
import {
  transformerTurnsRatioExample,
  runTransformerTurnsRatio,
} from "./tool.js";

describe("Turns Ratio", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runTransformerTurnsRatio(transformerTurnsRatioExample.input),
    ).toEqual({ ok: true, output: transformerTurnsRatioExample.output }));

  it("divides 1000 primary turns by 50 secondary turns", () =>
    expect(
      runTransformerTurnsRatio({ primaryTurns: 1000, secondaryTurns: 50 }),
    ).toEqual({ ok: true, output: { turnsRatio: 20 } }));

  it("returns one for identical windings", () =>
    expect(
      runTransformerTurnsRatio({ primaryTurns: 120, secondaryTurns: 120 }),
    ).toEqual({ ok: true, output: { turnsRatio: 1 } }));

  it("reciprocal ratios multiply back to one", () => {
    const forward = runTransformerTurnsRatio({
      primaryTurns: 300,
      secondaryTurns: 7,
    });
    const reverse = runTransformerTurnsRatio({
      primaryTurns: 7,
      secondaryTurns: 300,
    });
    expect(forward.ok).toBe(true);
    expect(reverse.ok).toBe(true);
    if (!forward.ok || !reverse.ok) return;
    expect(
      Number(forward.output.turnsRatio) * Number(reverse.output.turnsRatio),
    ).toBeCloseTo(1);
  });

  it("rejects zero secondary turns", () =>
    expect(
      runTransformerTurnsRatio({ primaryTurns: 500, secondaryTurns: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "secondaryTurns" }],
      },
      ok: false,
    }));

  it("rejects negative primary turns", () =>
    expect(
      runTransformerTurnsRatio({ primaryTurns: -500, secondaryTurns: 100 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "primaryTurns" }] },
      ok: false,
    }));

  it("rejects fractional turns", () =>
    expect(
      runTransformerTurnsRatio({ primaryTurns: 500.5, secondaryTurns: 100 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "primaryTurns" }] },
      ok: false,
    }));
});
