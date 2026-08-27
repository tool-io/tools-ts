import { describe, expect, it } from "vitest";
import {
  redCellDistributionWidthExample,
  runRedCellDistributionWidth,
} from "./tool.js";

describe("RDW-CV Percent", () => {
  it("publishes an executable example", () =>
    expect(
      runRedCellDistributionWidth(redCellDistributionWidthExample.input),
    ).toEqual({
      ok: true,
      output: redCellDistributionWidthExample.output,
    }));
  it("allows zero standard deviation", () =>
    expect(
      runRedCellDistributionWidth({
        rbcVolumeSdFemtoliters: 0,
        mcvFemtoliters: 80,
      }),
    ).toEqual({ ok: true, output: { rdwCvPercent: 0 } }));
  it("computes another valid result", () =>
    expect(
      runRedCellDistributionWidth({
        rbcVolumeSdFemtoliters: 6.3,
        mcvFemtoliters: 84,
      }),
    ).toEqual({ ok: true, output: { rdwCvPercent: 7.5 } }));
  it("rejects zero MCV", () => {
    const result = runRedCellDistributionWidth({
      rbcVolumeSdFemtoliters: 12,
      mcvFemtoliters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative standard deviation", () => {
    const result = runRedCellDistributionWidth({
      rbcVolumeSdFemtoliters: -12,
      mcvFemtoliters: 90,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative MCV", () => {
    const result = runRedCellDistributionWidth({
      rbcVolumeSdFemtoliters: 12,
      mcvFemtoliters: -90,
    });
    expect(result.ok).toBe(false);
  });
});
