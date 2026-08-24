import { describe, expect, it } from "vitest";
import {
  carolingianSinglestoreyFlagExample,
  runCarolingianSinglestoreyFlag,
} from "./tool.js";

describe("carolingian-singlestorey-flag", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCarolingianSinglestoreyFlag(carolingianSinglestoreyFlagExample.input),
    ).toEqual({
      ok: true,
      output: carolingianSinglestoreyFlagExample.output,
    });
  });

  it("stays unflagged when double-storey forms dominate", () => {
    const result = runCarolingianSinglestoreyFlag({
      doubleStoreyACount: 15,
      singleStoreyACount: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.carolingianProfile).toBe(false);
    expect(result.output.singleStoreyASharePct as number).toBeCloseTo(25);
  });

  it("rejects samples without any a glyph", () => {
    expect(
      runCarolingianSinglestoreyFlag({
        doubleStoreyACount: 0,
        singleStoreyACount: 0,
      }).ok,
    ).toBe(false);
  });
});
