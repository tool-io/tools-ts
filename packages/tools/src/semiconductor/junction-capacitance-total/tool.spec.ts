import { describe, expect, it } from "vitest";
import { junctionCapacitanceTotalExample, runJunctionCapacitanceTotal } from "./tool.js";

describe("junction capacitance total calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJunctionCapacitanceTotal(junctionCapacitanceTotalExample.input)).toEqual({
      ok: true,
      output: junctionCapacitanceTotalExample.output,
    });
  });

  it("defaults diffusion capacitance to zero", () => {
    expect(runJunctionCapacitanceTotal({ junctionCapacitancePf: 12 })).toEqual({
      ok: true,
      output: { totalPf: 12 },
    });
  });

  it("rejects negative capacitances through execution", () => {
    expect(runJunctionCapacitanceTotal({ junctionCapacitancePf: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_capacitance" }] },
      ok: false,
    });
  });
});
