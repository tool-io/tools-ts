import { describe, expect, it } from "vitest";
import {
  runTowerTroyPoundNoteGenerator,
  towerTroyPoundNoteGeneratorExample,
} from "./tool.js";

describe("tower-troy-pound-note-generator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTowerTroyPoundNoteGenerator(towerTroyPoundNoteGeneratorExample.input),
    ).toEqual({ ok: true, output: towerTroyPoundNoteGeneratorExample.output });
  });

  it("scales half a Tower pound proportionally", () => {
    expect(runTowerTroyPoundNoteGenerator({ towerPounds: 0.5 })).toEqual({
      ok: true,
      output: {
        towerGrains: 2700,
        troyPounds: 0.46875,
        sterlingPennies: 120,
        grams: 174.957057,
      },
    });
  });

  it("rejects negative masses", () => {
    expect(runTowerTroyPoundNoteGenerator({ towerPounds: -1 }).ok).toBe(false);
  });

  it("converts zero mass without an artificial domain error", () => {
    expect(runTowerTroyPoundNoteGenerator({ towerPounds: 0 })).toEqual({
      ok: true,
      output: { towerGrains: 0, troyPounds: 0, sterlingPennies: 0, grams: 0 },
    });
  });
});
