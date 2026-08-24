import { describe, expect, it } from "vitest";
import { runTsvCapacitance, tsvCapacitanceExample } from "./tool.js";

describe("coaxial TSV capacitance", () => {
  it("reproduces the documented example", () =>
    expect(runTsvCapacitance(tsvCapacitanceExample.input)).toEqual({
      ok: true,
      output: tsvCapacitanceExample.output,
    }));
  it("doubles with via height", () => {
    const result = runTsvCapacitance({
      ...tsvCapacitanceExample.input,
      heightUm: 40,
    });
    expect(result.ok && result.output.capacitanceFF).toBeCloseTo(
      2 * tsvCapacitanceExample.output.capacitanceFF,
      12,
    );
  });
  it("rejects zero oxide thickness", () =>
    expect(
      runTsvCapacitance({
        ...tsvCapacitanceExample.input,
        oxideThicknessUm: 0,
      }),
    ).toMatchObject({ ok: false }));
});
