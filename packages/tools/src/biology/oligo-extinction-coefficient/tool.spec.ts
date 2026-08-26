import { describe, expect, it } from "vitest";
import { runOligoExtinctionCoefficient } from "./tool.js";

describe("Oligo Extinction Coefficient", () => {
  it("calculates a valid result", () =>
    expect(runOligoExtinctionCoefficient({ sequence: "GATTACA" })).toEqual({
      ok: true,
      output: { extinctionCoefficient: 82500 },
    }));
  it("scores a single adenine", () =>
    expect(runOligoExtinctionCoefficient({ sequence: "A" })).toEqual({
      ok: true,
      output: { extinctionCoefficient: 15400 },
    }));
  it("scores a cytosine homopolymer", () =>
    expect(runOligoExtinctionCoefficient({ sequence: "CCCC" })).toEqual({
      ok: true,
      output: { extinctionCoefficient: 29600 },
    }));
  it("rejects an empty sequence", () => {
    const result = runOligoExtinctionCoefficient({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects non-base characters", () =>
    expect(runOligoExtinctionCoefficient({ sequence: "GATTACA!" }).ok).toBe(
      false,
    ));
  it("rejects lowercase bases", () =>
    expect(runOligoExtinctionCoefficient({ sequence: "gattaca" }).ok).toBe(
      false,
    ));
});
