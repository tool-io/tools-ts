import { describe, expect, it } from "vitest";
import {
  calculateLoadFactor,
  loadFactorExample,
  runLoadFactor,
} from "./tool.js";

describe("load factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLoadFactor(loadFactorExample.input)).toEqual({
      ok: true,
      output: loadFactorExample.output,
    });
  });

  it("returns one g in level flight and grows with bank", () => {
    expect(calculateLoadFactor({ bankAngleDeg: 0 })).toEqual({
      loadFactorG: 1,
    });
    const shallow = calculateLoadFactor({ bankAngleDeg: 30 });
    const steep = calculateLoadFactor({ bankAngleDeg: 60 });
    expect(shallow.loadFactorG).toBeGreaterThan(1);
    expect(steep.loadFactorG).toBeGreaterThan(shallow.loadFactorG);
  });

  it("rejects ninety-degree banks through execution", () => {
    expect(runLoadFactor({ bankAngleDeg: 90 })).toMatchObject({
      error: { issues: [{ code: "invalid_bank_angle" }] },
      ok: false,
    });
  });

  it("rejects banks beyond ninety degrees through execution", () => {
    expect(runLoadFactor({ bankAngleDeg: 120 })).toMatchObject({
      error: { issues: [{ code: "invalid_bank_angle" }] },
      ok: false,
    });
  });

  it("accepts negative bank angles for turns in the opposite direction", () => {
    expect(calculateLoadFactor({ bankAngleDeg: -60 })).toEqual({
      loadFactorG: 2,
    });
  });

  it("rejects non-finite angles in the direct calculation", () => {
    expect(() =>
      calculateLoadFactor({ bankAngleDeg: Number.NaN }),
    ).toThrowError("greater than -90 degrees");
  });
});
