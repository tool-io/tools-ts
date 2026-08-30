import { describe, expect, it } from "vitest";
import {
  lookupMooreLawEndgameNote,
  mooreEndgameExample,
  runMooreEndgame,
} from "./tool.js";

describe("Moore Law endgame note lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runMooreEndgame(mooreEndgameExample.input)).toEqual({
      ok: true,
      output: mooreEndgameExample.output,
    });
  });

  it("classifies a fin-feature-sized node", () => {
    expect(
      lookupMooreLawEndgameNote({ featureSizeNanometers: 7 }).featureSizeBand,
    ).toBe("7 nm to below 65 nm");
  });

  it("classifies a mature node", () => {
    expect(
      lookupMooreLawEndgameNote({ featureSizeNanometers: 180 }).featureSizeBand,
    ).toBe("130 nm and above");
  });

  it("rejects a nonpositive feature size", () => {
    expect(runMooreEndgame({ featureSizeNanometers: 0 })).toMatchObject({
      error: {
        issues: [
          { code: "invalid_feature_size", field: "featureSizeNanometers" },
        ],
      },
      ok: false,
    });
  });
});
