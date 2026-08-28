import { describe, expect, it } from "vitest";
import {
  runWyeToDeltaResistance,
  wyeToDeltaResistanceExample,
} from "./tool.js";

describe("Wye To Delta RA", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWyeToDeltaResistance(wyeToDeltaResistanceExample.input)).toEqual({
      ok: true,
      output: wyeToDeltaResistanceExample.output,
    });
  });

  it("converts an equal wye of twenty ohms to sixty ohm delta arms", () => {
    expect(
      runWyeToDeltaResistance({ r1Ohms: 20, r2Ohms: 20, r3Ohms: 20 }),
    ).toEqual({ ok: true, output: { deltaRaOhms: 60 } });
  });

  it("lowers RA as the opposite wye arm grows", () => {
    expect(
      runWyeToDeltaResistance({ r1Ohms: 40, r2Ohms: 20, r3Ohms: 20 }),
    ).toEqual({ ok: true, output: { deltaRaOhms: 50 } });
  });

  it("rejects zero or negative wye resistances", () => {
    expect(
      runWyeToDeltaResistance({ r1Ohms: 10, r2Ohms: 0, r3Ohms: 30 }).ok,
    ).toBe(false);
    expect(
      runWyeToDeltaResistance({ r1Ohms: 10, r2Ohms: -20, r3Ohms: 30 }).ok,
    ).toBe(false);
  });

  it("requires all three wye arms", () => {
    expect(runWyeToDeltaResistance({ r1Ohms: 10, r2Ohms: 20 }).ok).toBe(false);
  });
});
