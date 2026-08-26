import { describe, expect, it } from "vitest";
import { panelOffcutExample, runPanelOffcut } from "./tool.js";

describe("Panel Offcut Percentage Calculator", () => {
  it("publishes an executable example", () =>
    expect(runPanelOffcut(panelOffcutExample.input)).toEqual({
      ok: true,
      output: panelOffcutExample.output,
    }));

  it.each([
    [{ panelAreaM2: 4.86, usedAreaM2: 4.86 }, { offcutPercent: 0 }],
    [{ panelAreaM2: 2.88, usedAreaM2: 0 }, { offcutPercent: 100 }],
    [{ panelAreaM2: 3.2, usedAreaM2: 0.8 }, { offcutPercent: 75 }],
    [{ panelAreaM2: 19.2, usedAreaM2: 14.4 }, { offcutPercent: 25 }],
    [
      { panelAreaM2: 4.86, usedAreaM2: 3.6 },
      { offcutPercent: 25.92592592592593 },
    ],
    [{ panelAreaM2: 1.44, usedAreaM2: 0.72 }, { offcutPercent: 50 }],
  ])("calculates $offcutPercent% offcut for $input", (input, output) =>
    expect(runPanelOffcut(input)).toEqual({ ok: true, output }),
  );

  it("reports zero waste for a fully used panel", () =>
    expect(runPanelOffcut({ panelAreaM2: 5, usedAreaM2: 5 })).toEqual({
      ok: true,
      output: { offcutPercent: 0 },
    }));

  it("rejects a used area above the panel area with invalid_used_area", () => {
    const result = runPanelOffcut({ panelAreaM2: 5, usedAreaM2: 5.01 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_used_area");
  });

  it("rejects a negative used area with invalid_used_area", () => {
    const result = runPanelOffcut({ panelAreaM2: 5, usedAreaM2: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_used_area");
  });

  it("rejects a non-positive panel area with invalid_panel_area", () => {
    expect(runPanelOffcut({ panelAreaM2: 0, usedAreaM2: 0 }).ok).toBe(false);
    const negative = runPanelOffcut({ panelAreaM2: -2, usedAreaM2: 1 });
    expect(negative.ok).toBe(false);
    if (!negative.ok)
      expect(negative.error.issues[0]?.code).toBe("invalid_panel_area");
  });

  it("rejects missing inputs", () => {
    expect(runPanelOffcut({ panelAreaM2: 5 }).ok).toBe(false);
    expect(runPanelOffcut({ usedAreaM2: 1 }).ok).toBe(false);
  });

  it("rejects malformed and unknown inputs", () => {
    expect(
      runPanelOffcut({
        panelAreaM2: Number.NaN,
        usedAreaM2: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
    expect(runPanelOffcut({ extra: 1, panelAreaM2: 5, usedAreaM2: 1 }).ok).toBe(
      false,
    );
  });
});
