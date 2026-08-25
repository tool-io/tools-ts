import { describe, expect, it } from "vitest";
import { runCellDilution } from "./tool.js";

describe("Cell Dilution C1V1=C2V2", () => {
  it("calculates a valid result", () =>
    expect(
      runCellDilution({ c1Stock: 100, c2Target: 25, v2Final: 10 }),
    ).toEqual({ ok: true, output: { stockVolumeMl: 2.5 } }));
  it("solves small stock aliquots", () =>
    expect(runCellDilution({ c1Stock: 200, c2Target: 50, v2Final: 2 })).toEqual(
      { ok: true, output: { stockVolumeMl: 0.5 } },
    ));
  it("returns the full volume for equal concentrations", () =>
    expect(runCellDilution({ c1Stock: 50, c2Target: 50, v2Final: 8 })).toEqual({
      ok: true,
      output: { stockVolumeMl: 8 },
    }));
  it("produces fractional volumes", () =>
    expect(runCellDilution({ c1Stock: 30, c2Target: 10, v2Final: 4 })).toEqual({
      ok: true,
      output: { stockVolumeMl: 1.3333333333333333 },
    }));
  it("returns zero stock volume for a zero target concentration", () =>
    expect(runCellDilution({ c1Stock: 100, c2Target: 0, v2Final: 10 })).toEqual(
      { ok: true, output: { stockVolumeMl: 0 } },
    ));
  it("rejects a zero final volume", () => {
    const result = runCellDilution({ c1Stock: 100, c2Target: 25, v2Final: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_value");
  });
  it("rejects non-positive stock concentrations", () =>
    expect(runCellDilution({ c1Stock: -5, c2Target: 25, v2Final: 10 }).ok).toBe(
      false,
    ));
});
