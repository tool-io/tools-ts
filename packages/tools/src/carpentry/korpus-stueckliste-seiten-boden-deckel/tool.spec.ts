import { describe, expect, it } from "vitest";
import { carcasePanelCountExample, runCarcasePanelCount } from "./tool.js";

describe("Carcase Panel Count Generator", () => {
  it("publishes an executable example", () =>
    expect(runCarcasePanelCount(carcasePanelCountExample.input)).toEqual({
      ok: true,
      output: carcasePanelCountExample.output,
    }));

  it.each([[16], [18], [22], [19.5]])(
    "sets the back reveal to the %d mm panel thickness",
    (panelThicknessMm) =>
      expect(
        runCarcasePanelCount({
          depthMm: 450,
          heightMm: 720,
          panelThicknessMm,
          widthMm: 800,
        }),
      ).toEqual({
        ok: true,
        output: {
          backCount: 1,
          backPanelRevealMm: panelThicknessMm,
          bottomCount: 1,
          leftSideCount: 1,
          rightSideCount: 1,
          topCount: 1,
        },
      }),
  );

  it("reports exactly one panel per face regardless of size", () => {
    for (const widthMm of [150, 600, 1200]) {
      const result = runCarcasePanelCount({
        depthMm: 320,
        heightMm: 920,
        panelThicknessMm: 18,
        widthMm,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.output.leftSideCount).toBe(1);
        expect(result.output.rightSideCount).toBe(1);
        expect(result.output.bottomCount).toBe(1);
        expect(result.output.topCount).toBe(1);
        expect(result.output.backCount).toBe(1);
      }
    }
  });

  it("rejects a zero or negative width with invalid_dimensions", () => {
    for (const widthMm of [0, -800]) {
      const result = runCarcasePanelCount({
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
    const result = runCarcasePanelCount({
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
    const result = runCarcasePanelCount({
      depthMm: -450,
      heightMm: 720,
      panelThicknessMm: 19,
      widthMm: 800,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects a zero or negative thickness with invalid_dimensions", () => {
    const result = runCarcasePanelCount({
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
      runCarcasePanelCount({ depthMm: 450, heightMm: 720, widthMm: 800 }).ok,
    ).toBe(false);
    expect(runCarcasePanelCount({}).ok).toBe(false);
  });

  it("rejects malformed and unknown inputs", () => {
    expect(
      runCarcasePanelCount({
        depthMm: Number.NaN,
        heightMm: 720,
        panelThicknessMm: 19,
        widthMm: 800,
      }).ok,
    ).toBe(false);
    expect(
      runCarcasePanelCount({
        depthMm: 450,
        extra: 1,
        heightMm: 720,
        panelThicknessMm: 19,
        widthMm: 800,
      }).ok,
    ).toBe(false);
  });
});
