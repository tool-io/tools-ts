import { describe, expect, it } from "vitest";
import {
  transformerCurrentRatioExample,
  runTransformerCurrentRatio,
} from "./tool.js";

describe("Current Ratio", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runTransformerCurrentRatio(transformerCurrentRatioExample.input),
    ).toEqual({ ok: true, output: transformerCurrentRatioExample.output }));

  it("scales current up for a step-up winding arrangement", () =>
    expect(
      runTransformerCurrentRatio({
        primaryCurrentA: 2,
        primaryTurns: 500,
        secondaryTurns: 100,
      }),
    ).toEqual({ ok: true, output: { secondaryCurrentA: 10 } }));

  it("keeps current unchanged for a 1:1 transformer", () =>
    expect(
      runTransformerCurrentRatio({
        primaryCurrentA: 2,
        primaryTurns: 80,
        secondaryTurns: 80,
      }),
    ).toEqual({ ok: true, output: { secondaryCurrentA: 2 } }));

  it("doubles the secondary current when the primary current doubles", () =>
    expect(
      runTransformerCurrentRatio({
        primaryCurrentA: 4,
        primaryTurns: 100,
        secondaryTurns: 500,
      }),
    ).toEqual({ ok: true, output: { secondaryCurrentA: 0.8 } }));

  it("rejects zero primary turns", () =>
    expect(
      runTransformerCurrentRatio({
        primaryCurrentA: 2,
        primaryTurns: 0,
        secondaryTurns: 500,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "primaryTurns" }] },
      ok: false,
    }));

  it("rejects zero secondary turns", () =>
    expect(
      runTransformerCurrentRatio({
        primaryCurrentA: 2,
        primaryTurns: 100,
        secondaryTurns: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "secondaryTurns" }],
      },
      ok: false,
    }));

  it("rejects fractional turns", () =>
    expect(
      runTransformerCurrentRatio({
        primaryCurrentA: 2,
        primaryTurns: 100,
        secondaryTurns: 50.5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "secondaryTurns" }] },
      ok: false,
    }));
});
