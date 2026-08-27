import { describe, expect, it } from "vitest";
import {
  deltaToWyeResistanceExample,
  runDeltaToWyeResistance,
} from "./tool.js";

describe("Delta To Wye R1", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeltaToWyeResistance(deltaToWyeResistanceExample.input)).toEqual({
      ok: true,
      output: deltaToWyeResistanceExample.output,
    });
  });

  it("converts an equal delta of thirty ohms to a ten ohm wye arm", () => {
    expect(
      runDeltaToWyeResistance({ rAOhms: 30, rBOhms: 30, rCOhms: 30 }),
    ).toEqual({ ok: true, output: { wyeR1Ohms: 10 } });
  });

  it("handles unequal delta arms", () => {
    expect(
      runDeltaToWyeResistance({ rAOhms: 170, rBOhms: 80, rCOhms: 100 }),
    ).toEqual({ ok: true, output: { wyeR1Ohms: 22.857142857142858 } });
  });

  it("scales linearly when all delta arms scale together", () => {
    expect(
      runDeltaToWyeResistance({ rAOhms: 40, rBOhms: 80, rCOhms: 120 }),
    ).toEqual({ ok: true, output: { wyeR1Ohms: 40 } });
  });

  it("rejects zero or negative delta resistances", () => {
    expect(
      runDeltaToWyeResistance({ rAOhms: 0, rBOhms: 40, rCOhms: 60 }).ok,
    ).toBe(false);
    expect(
      runDeltaToWyeResistance({ rAOhms: -20, rBOhms: 40, rCOhms: 60 }).ok,
    ).toBe(false);
  });

  it("requires all three delta arms", () => {
    expect(runDeltaToWyeResistance({ rAOhms: 20, rBOhms: 40 }).ok).toBe(false);
  });
});
