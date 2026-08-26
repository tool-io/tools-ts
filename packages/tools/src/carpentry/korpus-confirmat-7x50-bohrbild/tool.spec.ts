import { describe, expect, it } from "vitest";
import {
  confirmatDrillingExample,
  confirmatDrillingTool,
  runConfirmatDrilling,
} from "./tool.js";

describe("Confirmat Drilling Pattern", () => {
  it("computes the canonical example", () =>
    expect(runConfirmatDrilling(confirmatDrillingExample.input)).toEqual({
      ok: true,
      output: { pilotHoleDiameterMm: 5, drillingDepthMm: 55 },
    }));

  it("accepts the 16 mm minimum board thickness", () =>
    expect(runConfirmatDrilling({ boardThicknessMm: 16 })).toEqual({
      ok: true,
      output: { pilotHoleDiameterMm: 5, drillingDepthMm: 55 },
    }));

  it.each([18, 22, 25])("accepts %p mm boards", (boardThicknessMm) =>
    expect(runConfirmatDrilling({ boardThicknessMm })).toEqual({
      ok: true,
      output: { pilotHoleDiameterMm: 5, drillingDepthMm: 55 },
    }),
  );

  it("rejects boards below 16 mm with board_too_thin", () => {
    const result = runConfirmatDrilling({ boardThicknessMm: 15.9 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toEqual({
        code: "board_too_thin",
        field: "boardThicknessMm",
        message:
          "Board thickness must be at least 16 mm for a 7x50 confirmat screw.",
      });
  });

  it("rejects very thin and negative boards", () => {
    expect(runConfirmatDrilling({ boardThicknessMm: 10 }).ok).toBe(false);
    expect(runConfirmatDrilling({ boardThicknessMm: -19 }).ok).toBe(false);
  });

  it("rejects non-finite board thickness", () => {
    expect(runConfirmatDrilling({ boardThicknessMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runConfirmatDrilling({ boardThicknessMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects non-numeric board thickness", () =>
    expect(runConfirmatDrilling({ boardThicknessMm: "19" } as never).ok).toBe(
      false,
    ));

  it("rejects a missing board thickness", () => {
    const result = runConfirmatDrilling({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runConfirmatDrilling({
      boardThicknessMm: 19,
      screwLengthMm: 50,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(confirmatDrillingExample))).toEqual(
      confirmatDrillingExample,
    );
    expect(confirmatDrillingTool.id).toBe(
      "carpentry/korpus-confirmat-7x50-bohrbild",
    );
    expect(confirmatDrillingTool.execution).toEqual({ kind: "pure" });
  });
});
