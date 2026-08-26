import { describe, expect, it } from "vitest";
import { runSolidWoodLamella, solidWoodLamellaExample } from "./tool.js";

describe("Solid Wood Lamella Width Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSolidWoodLamella(solidWoodLamellaExample.input)).toEqual({
      ok: true,
      output: solidWoodLamellaExample.output,
    }));

  it("divides a narrow panel evenly below the cap", () =>
    expect(
      runSolidWoodLamella({ lamellaCount: 16, panelWidthMm: 800 }),
    ).toEqual({
      ok: true,
      output: { recommendedLamellaWidthMm: 50 },
    }));

  it("caps the recommendation at 80 millimeters", () =>
    expect(
      runSolidWoodLamella({ lamellaCount: 15, panelWidthMm: 1600 }),
    ).toEqual({
      ok: true,
      output: { recommendedLamellaWidthMm: 80 },
    }));

  it("returns the full panel width for one narrow lamella", () =>
    expect(runSolidWoodLamella({ lamellaCount: 1, panelWidthMm: 60 })).toEqual({
      ok: true,
      output: { recommendedLamellaWidthMm: 60 },
    }));

  it("caps a single wide lamella at 80 millimeters", () =>
    expect(runSolidWoodLamella({ lamellaCount: 1, panelWidthMm: 500 })).toEqual(
      {
        ok: true,
        output: { recommendedLamellaWidthMm: 80 },
      },
    ));

  it("accepts exactly one lamella as the lower boundary", () =>
    expect(runSolidWoodLamella({ lamellaCount: 1, panelWidthMm: 80 })).toEqual({
      ok: true,
      output: { recommendedLamellaWidthMm: 80 },
    }));

  it("produces fractional widths when division is uneven", () => {
    const result = runSolidWoodLamella({ lamellaCount: 3, panelWidthMm: 100 });
    if (result.ok)
      expect(result.output.recommendedLamellaWidthMm).toBeCloseTo(
        33.333333333333336,
        12,
      );
    else expect.fail("expected a successful result");
  });

  it("rejects a zero or negative panel width", () => {
    for (const panelWidthMm of [0, -960]) {
      const result = runSolidWoodLamella({ lamellaCount: 10, panelWidthMm });
      expect(result.ok).toBe(false);
      if (!result.ok)
        expect(result.error.issues[0]?.code).toBe("invalid_panel_width");
    }
  });

  it("rejects a zero lamella count", () => {
    const result = runSolidWoodLamella({ lamellaCount: 0, panelWidthMm: 800 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects a negative or fractional lamella count", () => {
    for (const lamellaCount of [-3, 2.5]) {
      const result = runSolidWoodLamella({ lamellaCount, panelWidthMm: 800 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_input");
    }
  });

  it("rejects non-finite input", () =>
    expect(
      runSolidWoodLamella({ lamellaCount: 10, panelWidthMm: Number.NaN }).ok,
    ).toBe(false));

  it("rejects unknown input fields", () =>
    expect(
      runSolidWoodLamella({
        lamellaCount: 10,
        panelWidthMm: 800,
        extra: 1,
      } as never).ok,
    ).toBe(false));
});
