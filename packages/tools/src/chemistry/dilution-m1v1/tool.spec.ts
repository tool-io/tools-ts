import { describe, expect, it } from "vitest";
import { dilutionM1V1Example, runDilutionM1V1 } from "./tool.js";

describe("Dilution M1V1=M2V2 Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDilutionM1V1(dilutionM1V1Example.input)).toEqual({
      ok: true,
      output: dilutionM1V1Example.output,
    });
  });

  it("dilutes fourfold to reach one liter", () => {
    expect(runDilutionM1V1({ m1: 4, v1: 2, m2: 8 })).toEqual({
      ok: true,
      output: { finalVolumeLiters: 1 },
    });
  });

  it("solves a fractional dilution", () => {
    expect(runDilutionM1V1({ m1: 3, v1: 0.5, m2: 1.5 })).toEqual({
      ok: true,
      output: { finalVolumeLiters: 1 },
    });
  });

  it("computes a larger final volume when concentrating less", () => {
    expect(runDilutionM1V1({ m1: 2, v1: 3, m2: 0.5 })).toEqual({
      ok: true,
      output: { finalVolumeLiters: 12 },
    });
  });

  it("rejects a zero initial concentration", () => {
    expect(runDilutionM1V1({ m1: 0, v1: 1, m2: 1 }).ok).toBe(false);
  });

  it("rejects a zero final concentration", () => {
    expect(runDilutionM1V1({ m1: 1, v1: 1, m2: 0 }).ok).toBe(false);
  });

  it("requires all three inputs", () => {
    expect(runDilutionM1V1({ m1: 1, v1: 1 }).ok).toBe(false);
    expect(runDilutionM1V1({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runDilutionM1V1("m1v1").ok).toBe(false);
  });
});
