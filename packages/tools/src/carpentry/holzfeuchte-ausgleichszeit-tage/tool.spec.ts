import { describe, expect, it } from "vitest";
import {
  runWoodAcclimatizationTime,
  woodAcclimatizationTimeExample,
  woodAcclimatizationTimeTool,
} from "./tool.js";

describe("Wood Acclimatization Time Calculator", () => {
  it("computes the canonical example", () =>
    expect(
      runWoodAcclimatizationTime(woodAcclimatizationTimeExample.input),
    ).toEqual({
      ok: true,
      output: { acclimatizationDays: 30 },
    }));

  it.each([
    [50, 60],
    [12, 14],
    [40, 48],
    [18.75, 23],
    [5, 6],
    [100, 120],
    [0.8, 1],
  ])("acclimates %p mm lumber in about %p days", (thicknessMm, expected) =>
    expect(runWoodAcclimatizationTime({ thicknessMm })).toEqual({
      ok: true,
      output: { acclimatizationDays: expected },
    }),
  );

  it("uses one month per 25 mm of thickness", () =>
    expect(runWoodAcclimatizationTime({ thicknessMm: 12.5 })).toEqual({
      ok: true,
      output: { acclimatizationDays: 15 },
    }));

  it("rounds half days up", () => {
    const exactHalf = Math.round((18.75 / 25) * 30);
    expect(exactHalf).toBe(23);
    expect(runWoodAcclimatizationTime({ thicknessMm: 18.75 })).toEqual({
      ok: true,
      output: { acclimatizationDays: 23 },
    });
  });

  it("returns an integer day count", () => {
    const result = runWoodAcclimatizationTime({ thicknessMm: 33 });
    expect(
      result.ok &&
        Number.isInteger(result.output.acclimatizationDays as number),
    ).toBe(true);
  });

  it("rejects zero and negative thickness", () => {
    const zero = runWoodAcclimatizationTime({ thicknessMm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "thicknessMm",
        message: "Thickness must be positive.",
      });
    expect(runWoodAcclimatizationTime({ thicknessMm: -25 }).ok).toBe(false);
  });

  it("rejects a missing thickness", () => {
    const result = runWoodAcclimatizationTime({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite thickness", () => {
    expect(runWoodAcclimatizationTime({ thicknessMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runWoodAcclimatizationTime({ thicknessMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric and unknown inputs", () => {
    expect(runWoodAcclimatizationTime({ thicknessMm: "25" } as never).ok).toBe(
      false,
    );
    const extra = runWoodAcclimatizationTime({
      thicknessMm: 25,
      species: "oak",
    } as never);
    expect(extra.ok).toBe(false);
    if (!extra.ok)
      expect(extra.error.issues[0]).toEqual({
        code: "unknown_field",
        field: "species",
        message: "species is not a supported input field.",
      });
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(woodAcclimatizationTimeExample))).toEqual(
      woodAcclimatizationTimeExample,
    );
    expect(woodAcclimatizationTimeTool.id).toBe(
      "carpentry/holzfeuchte-ausgleichszeit-tage",
    );
    expect(woodAcclimatizationTimeTool.execution).toEqual({ kind: "pure" });
    expect(
      woodAcclimatizationTimeTool.outputSchema.properties?.acclimatizationDays,
    ).toMatchObject({ type: "integer" });
  });
});
