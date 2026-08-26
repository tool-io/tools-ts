import { describe, expect, it } from "vitest";
import { drawerBomExample, runDrawerBom } from "./tool.js";

describe("Drawer Bill of Materials Generator", () => {
  it("publishes an executable example", () =>
    expect(runDrawerBom(drawerBomExample.input)).toEqual({
      ok: true,
      output: drawerBomExample.output,
    }));

  it.each([
    [{ depthMm: 300, heightMm: 100, widthMm: 300 }, { totalPanelAreaM2: 0.21 }],
    [{ depthMm: 500, heightMm: 80, widthMm: 600 }, { totalPanelAreaM2: 0.476 }],
    [
      { depthMm: 550, heightMm: 200, widthMm: 150 },
      { totalPanelAreaM2: 0.3625 },
    ],
    [
      { depthMm: 270.5, heightMm: 88.25, widthMm: 496 },
      { totalPanelAreaM2: 0.26945525 },
    ],
  ])("calculates $totalPanelAreaM2 m² for $input", (input, partial) =>
    expect(runDrawerBom(input)).toEqual({
      ok: true,
      output: {
        ...partial,
        bottomCount: 1,
        frontBackCount: 2,
        sideCount: 2,
      },
    }),
  );

  it("always reports two fronts and backs, two sides, and one bottom", () => {
    const result = runDrawerBom({
      depthMm: 550,
      heightMm: 199,
      widthMm: 1000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.frontBackCount).toBe(2);
      expect(result.output.sideCount).toBe(2);
      expect(result.output.bottomCount).toBe(1);
    }
  });

  it("rejects a zero or negative width with invalid_dimensions", () => {
    for (const widthMm of [0, -500]) {
      const result = runDrawerBom({ depthMm: 450, heightMm: 120, widthMm });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
    }
  });

  it("rejects a zero or negative depth with invalid_dimensions", () => {
    const result = runDrawerBom({ depthMm: 0, heightMm: 120, widthMm: 500 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects a zero or negative height with invalid_dimensions", () => {
    const result = runDrawerBom({ depthMm: 450, heightMm: -120, widthMm: 500 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_dimensions");
  });

  it("rejects missing inputs", () => {
    expect(runDrawerBom({ depthMm: 450, heightMm: 120 }).ok).toBe(false);
    expect(runDrawerBom({}).ok).toBe(false);
  });

  it("rejects malformed and unknown inputs", () => {
    expect(
      runDrawerBom({
        depthMm: Number.POSITIVE_INFINITY,
        heightMm: 120,
        widthMm: 500,
      }).ok,
    ).toBe(false);
    expect(
      runDrawerBom({ depthMm: 450, extra: 1, heightMm: 120, widthMm: 500 }).ok,
    ).toBe(false);
  });
});
