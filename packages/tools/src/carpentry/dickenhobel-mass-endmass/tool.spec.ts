import { describe, expect, it } from "vitest";
import {
  runThicknessPlanerFinalSize,
  thicknessPlanerFinalSizeExample,
  thicknessPlanerFinalSizeTool,
} from "./tool.js";

const run = (
  rawThicknessMm: number,
  passCount: number,
  perPassMillimeters: number,
) =>
  runThicknessPlanerFinalSize({
    passCount,
    perPassMillimeters,
    rawThicknessMm,
  });

describe("Thickness Planer Final Size Calculator", () => {
  it("computes the canonical example", () =>
    expect(
      runThicknessPlanerFinalSize(thicknessPlanerFinalSizeExample.input),
    ).toEqual({
      ok: true,
      output: { finalThicknessMm: 24 },
    }));

  it.each([
    [50, 5, 2.5, 37.5],
    [19, 1, 0.5, 18.5],
    [25.4, 2, 1, 23.4],
  ])(
    "removes %p mm per pass over %p passes from %p mm stock",
    (raw, passes, perPass, expected) =>
      expect(run(raw, passes, perPass)).toEqual({
        ok: true,
        output: { finalThicknessMm: expected },
      }),
  );

  it("allows planing down to exactly zero thickness", () =>
    expect(run(10, 5, 2)).toEqual({
      ok: true,
      output: { finalThicknessMm: 0 },
    }));

  it("rejects plans that remove more than the raw thickness", () =>
    expect(run(10, 6, 2)).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "negative_thickness",
            field: "passCount",
            message: "removes more than raw thickness",
          },
        ],
      },
    }));

  it("rejects a pass count below one", () => {
    const zero = run(30, 0, 2);
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "invalid_field",
        field: "passCount",
        message: "Pass count is invalid.",
      });
  });

  it("rejects a fractional pass count", () =>
    expect(run(30, 2.5, 2).ok).toBe(false));

  it("rejects non-positive removal per pass", () => {
    const zero = run(30, 3, 0);
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
    expect(run(30, 3, -1).ok).toBe(false);
  });

  it("rejects non-positive raw thickness", () => {
    const zero = run(0, 3, 2);
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.error.issues[0]?.code).toBe("must_be_positive");
    expect(run(-30, 3, 2).ok).toBe(false);
  });

  it("rejects missing and non-finite raw thickness", () => {
    expect(
      runThicknessPlanerFinalSize({
        passCount: 3,
        perPassMillimeters: 2,
      }).ok,
    ).toBe(false);
    expect(
      runThicknessPlanerFinalSize({
        passCount: 3,
        perPassMillimeters: 2,
        rawThicknessMm: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runThicknessPlanerFinalSize({
      passCount: 3,
      perPassMillimeters: 2,
      rawThicknessMm: 30,
      feedRate: 5,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "unknown_field",
        field: "feedRate",
        message: "feedRate is not a supported input field.",
      });
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(thicknessPlanerFinalSizeExample))).toEqual(
      thicknessPlanerFinalSizeExample,
    );
    expect(thicknessPlanerFinalSizeTool.id).toBe(
      "carpentry/dickenhobel-mass-endmass",
    );
    expect(thicknessPlanerFinalSizeTool.execution).toEqual({ kind: "pure" });
    expect(
      thicknessPlanerFinalSizeTool.inputSchema.properties?.passCount,
    ).toMatchObject({ type: "integer", minimum: 1 });
  });
});
