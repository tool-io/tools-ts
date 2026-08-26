import { describe, expect, it } from "vitest";
import { carcaseBomExample, runCarcaseBom } from "./tool.js";

describe("Carcase Bill of Materials Generator", () => {
  it("publishes an executable example", () =>
    expect(runCarcaseBom(carcaseBomExample.input)).toEqual({
      ok: true,
      output: carcaseBomExample.output,
    }));

  it.each([
    [
      { depthMm: 200, heightMm: 500, panelThicknessMm: 18, widthMm: 300 },
      { totalPanelAreaM2: 0.47 },
    ],
    [
      { depthMm: 500, heightMm: 500, panelThicknessMm: 19, widthMm: 500 },
      { totalPanelAreaM2: 1.25 },
    ],
    [
      { depthMm: 50, heightMm: 400, panelThicknessMm: 16, widthMm: 600 },
      { totalPanelAreaM2: 0.34 },
    ],
    [
      { depthMm: 584, heightMm: 2000, panelThicknessMm: 19, widthMm: 600 },
      { totalPanelAreaM2: 4.2368 },
    ],
    [
      { depthMm: 360.5, heightMm: 578, panelThicknessMm: 18, widthMm: 812.5 },
      { totalPanelAreaM2: 1.4721755 },
    ],
  ])("calculates $totalPanelAreaM2 m² for $input", (input, partial) =>
    expect(runCarcaseBom(input)).toEqual({
      ok: true,
      output: {
        ...partial,
        backPanelCount: 1,
        sidePanelCount: 2,
        topBottomCount: 2,
      },
    }),
  );

  it("always reports two sides, top and bottom, and one back", () => {
    for (const widthMm of [100, 600, 1200]) {
      const result = runCarcaseBom({
        depthMm: 400,
        heightMm: 750,
        panelThicknessMm: 19,
        widthMm,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.output.sidePanelCount).toBe(2);
        expect(result.output.topBottomCount).toBe(2);
        expect(result.output.backPanelCount).toBe(1);
      }
    }
  });

  it("rejects a zero or negative width with invalid_dimensions", () => {
    for (const widthMm of [0, -800]) {
      const result = runCarcaseBom({
        depthMm: 450,
        heightMm: 720,
        panelThicknessMm: 19,
        widthMm,
      });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
    }
  });

  it("rejects a zero or negative height with invalid_dimensions", () => {
    const result = runCarcaseBom({
      depthMm: 450,
      heightMm: 0,
      panelThicknessMm: 19,
      widthMm: 800,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects a zero or negative depth with invalid_dimensions", () => {
    const result = runCarcaseBom({
      depthMm: -1,
      heightMm: 720,
      panelThicknessMm: 19,
      widthMm: 800,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects a zero or negative panel thickness with invalid_dimensions", () => {
    const result = runCarcaseBom({
      depthMm: 450,
      heightMm: 720,
      panelThicknessMm: 0,
      widthMm: 800,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects missing inputs", () => {
    expect(
      runCarcaseBom({ depthMm: 450, heightMm: 720, widthMm: 800 }).ok,
    ).toBe(false);
  });

  it("rejects malformed and unknown inputs", () => {
    expect(
      runCarcaseBom({
        depthMm: Number.NaN,
        heightMm: 720,
        panelThicknessMm: 19,
        widthMm: 800,
      }).ok,
    ).toBe(false);
    expect(
      runCarcaseBom({
        depthMm: 450,
        extra: 1,
        heightMm: 720,
        panelThicknessMm: 19,
        widthMm: 800,
      }).ok,
    ).toBe(false);
  });
});
