import { describe, expect, it } from "vitest";
import {
  foresightMaturityExample,
  lookupForesightMaturityStage,
  runForesightMaturity,
} from "./tool.js";

describe("foresight maturity integrated stages lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runForesightMaturity(foresightMaturityExample.input)).toEqual({
      ok: true,
      output: foresightMaturityExample.output,
    });
  });

  it("looks up the initial stage", () => {
    expect(lookupForesightMaturityStage({ maturityStage: 1 }).stageName).toBe(
      "initial",
    );
  });

  it("uses a sustain message for the final stage", () => {
    expect(
      lookupForesightMaturityStage({ maturityStage: 5 }).nextStageFocus,
    ).toContain("Sustain adaptive learning");
  });

  it("rejects a stage outside one through five", () => {
    expect(runForesightMaturity({ maturityStage: 6 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "maturityStage" }],
      },
      ok: false,
    });
  });
});
