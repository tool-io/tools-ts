import { describe, expect, it } from "vitest";
import {
  navLightLuminousRangeCorrectedExample,
  runNavLightLuminousRangeCorrected,
} from "./tool.js";

describe("Light Range Corrected", () => {
  it("calculates the canonical example exactly", () => {
    expect(
      runNavLightLuminousRangeCorrected(
        navLightLuminousRangeCorrectedExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { correctedRangeNm: 7.547733061615517 },
    });
  });

  it("returns nominal range at the ten-mile reference visibility", () => {
    expect(
      runNavLightLuminousRangeCorrected({
        nominalRangeNm: 12,
        visibilityNm: 10,
      }),
    ).toEqual({ ok: true, output: { correctedRangeNm: 12 } });
  });

  it("applies atmospheric transmission rather than linear scaling", () => {
    const poor = runNavLightLuminousRangeCorrected({
      nominalRangeNm: 10,
      visibilityNm: 2.5,
    });
    if (!poor.ok) throw new Error("expected success");
    expect(poor.output.correctedRangeNm).toBeCloseTo(4.0207083297918995, 12);
    const result = runNavLightLuminousRangeCorrected({
      nominalRangeNm: 15,
      visibilityNm: 8,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedRangeNm).toBeCloseTo(12.833244803793942, 12);
  });

  it("increases luminous range when visibility exceeds ten miles", () => {
    const result = runNavLightLuminousRangeCorrected({
      nominalRangeNm: 12,
      visibilityNm: 25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedRangeNm).toBeCloseTo(20.810820628862132, 12);
  });

  it("collapses to zero range in zero visibility", () => {
    expect(
      runNavLightLuminousRangeCorrected({
        nominalRangeNm: 20,
        visibilityNm: 0,
      }),
    ).toEqual({ ok: true, output: { correctedRangeNm: 0 } });
  });

  it("rejects non-positive nominal ranges", () => {
    expect(
      runNavLightLuminousRangeCorrected({
        nominalRangeNm: 0,
        visibilityNm: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "nominalRangeNm" }] },
      ok: false,
    });
    expect(
      runNavLightLuminousRangeCorrected({
        nominalRangeNm: -4,
        visibilityNm: 5,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative visibility at the schema level", () => {
    expect(
      runNavLightLuminousRangeCorrected({
        nominalRangeNm: 10,
        visibilityNm: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "visibilityNm" }] },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    expect(
      runNavLightLuminousRangeCorrected({
        nominalRangeNm: Number.NaN,
        visibilityNm: 5,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runNavLightLuminousRangeCorrected({
        character: "Fl",
        nominalRangeNm: 12,
        visibilityNm: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "character" }] },
      ok: false,
    });
    expect(runNavLightLuminousRangeCorrected(null).ok).toBe(false);
    expect(runNavLightLuminousRangeCorrected({}).ok).toBe(false);
  });
});
