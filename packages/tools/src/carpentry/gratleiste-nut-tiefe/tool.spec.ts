import { describe, expect, it } from "vitest";
import {
  backPanelGrooveDepthExample,
  backPanelGrooveDepthTool,
  runBackPanelGrooveDepth,
} from "./tool.js";

describe("Back Panel Groove Depth Calculator", () => {
  it("computes the canonical example", () =>
    expect(runBackPanelGrooveDepth(backPanelGrooveDepthExample.input)).toEqual({
      ok: true,
      output: { grooveDepthMm: 9.5 },
    }));

  it.each([
    [16, 8],
    [18, 9],
    [25, 12.5],
  ])("grooves %p mm panels to %p mm depth", (panelThicknessMm, expected) =>
    expect(runBackPanelGrooveDepth({ panelThicknessMm })).toEqual({
      ok: true,
      output: { grooveDepthMm: expected },
    }),
  );

  it("halves fractional thicknesses", () =>
    expect(runBackPanelGrooveDepth({ panelThicknessMm: 6.5 })).toEqual({
      ok: true,
      output: { grooveDepthMm: 3.25 },
    }));

  it("rejects zero and negative panel thickness", () => {
    const zero = runBackPanelGrooveDepth({ panelThicknessMm: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]).toEqual({
        code: "must_be_positive",
        field: "panelThicknessMm",
        message: "Panel thickness must be positive.",
      });
    expect(runBackPanelGrooveDepth({ panelThicknessMm: -8 }).ok).toBe(false);
  });

  it("rejects non-finite panel thickness", () => {
    expect(runBackPanelGrooveDepth({ panelThicknessMm: Number.NaN }).ok).toBe(
      false,
    );
    expect(
      runBackPanelGrooveDepth({ panelThicknessMm: Number.POSITIVE_INFINITY })
        .ok,
    ).toBe(false);
  });

  it("rejects non-numeric panel thickness", () =>
    expect(
      runBackPanelGrooveDepth({ panelThicknessMm: "19" } as never).ok,
    ).toBe(false));

  it("rejects a missing panel thickness", () => {
    const result = runBackPanelGrooveDepth({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runBackPanelGrooveDepth({
      panelThicknessMm: 19,
      grooveWidthMm: 6,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(backPanelGrooveDepthExample))).toEqual(
      backPanelGrooveDepthExample,
    );
    expect(backPanelGrooveDepthTool.id).toBe("carpentry/gratleiste-nut-tiefe");
    expect(backPanelGrooveDepthTool.execution).toEqual({ kind: "pure" });
  });
});
