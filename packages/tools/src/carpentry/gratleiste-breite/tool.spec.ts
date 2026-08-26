import { describe, expect, it } from "vitest";
import { cleatWidthExample, cleatWidthTool, runCleatWidth } from "./tool.js";

describe("Cleat Width Rule Calculator", () => {
  it("computes the canonical example", () =>
    expect(runCleatWidth(cleatWidthExample.input)).toEqual({
      ok: true,
      output: { cleatWidthMm: 38 },
    }));

  it.each([
    [19, 38],
    [25, 50],
    [22, 44],
  ])(
    "uses twice the %p mm thickness for %p mm cleats",
    (panelThicknessMm, expected) =>
      expect(runCleatWidth({ panelThicknessMm })).toEqual({
        ok: true,
        output: { cleatWidthMm: expected },
      }),
  );

  it("clamps thin panels to the 30 mm minimum", () => {
    expect(runCleatWidth({ panelThicknessMm: 12 })).toEqual({
      ok: true,
      output: { cleatWidthMm: 30 },
    });
    expect(runCleatWidth({ panelThicknessMm: 8 })).toEqual({
      ok: true,
      output: { cleatWidthMm: 30 },
    });
  });

  it("meets the minimum exactly at 15 mm panels", () =>
    expect(runCleatWidth({ panelThicknessMm: 15 })).toEqual({
      ok: true,
      output: { cleatWidthMm: 30 },
    }));

  it("exceeds the minimum just above the crossover", () =>
    expect(runCleatWidth({ panelThicknessMm: 15.5 })).toEqual({
      ok: true,
      output: { cleatWidthMm: 31 },
    }));

  it("rejects zero and negative panel thickness", () => {
    const zero = runCleatWidth({ panelThicknessMm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "panelThicknessMm",
        message: "Panel thickness must be positive.",
      });
    expect(runCleatWidth({ panelThicknessMm: -19 }).ok).toBe(false);
  });

  it("rejects non-finite and non-numeric thickness", () => {
    expect(runCleatWidth({ panelThicknessMm: Number.NaN }).ok).toBe(false);
    expect(runCleatWidth({ panelThicknessMm: "19" } as never).ok).toBe(false);
  });

  it("rejects a missing panel thickness", () => {
    const result = runCleatWidth({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runCleatWidth({
      panelThicknessMm: 19,
      cleatMaterial: "pine",
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(cleatWidthExample))).toEqual(
      cleatWidthExample,
    );
    expect(cleatWidthTool.id).toBe("carpentry/gratleiste-breite");
    expect(cleatWidthTool.execution).toEqual({ kind: "pure" });
  });
});
