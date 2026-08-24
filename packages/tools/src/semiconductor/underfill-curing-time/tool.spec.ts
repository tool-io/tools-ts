import { describe, expect, it } from "vitest";
import { runUnderfillCuringTime, underfillCuringTimeExample } from "./tool.js";

describe("underfill Q10 cure-time heuristic", () => {
  it("reproduces the documented example", () =>
    expect(runUnderfillCuringTime(underfillCuringTimeExample.input)).toEqual({
      ok: true,
      output: underfillCuringTimeExample.output,
    }));
  it("returns reference time at reference temperature", () =>
    expect(
      runUnderfillCuringTime({
        cureTempC: 150,
        referenceMinutes: 60,
        referenceTempC: 150,
      }),
    ).toEqual({ ok: true, output: { cureMinutes: 60 } }));
  it("supports a material-specific Q10 factor", () =>
    expect(
      runUnderfillCuringTime({
        cureTempC: 140,
        q10Factor: 3,
        referenceMinutes: 60,
        referenceTempC: 150,
      }),
    ).toEqual({ ok: true, output: { cureMinutes: 180 } }));
});
