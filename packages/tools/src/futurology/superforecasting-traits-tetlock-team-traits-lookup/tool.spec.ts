import { describe, expect, it } from "vitest";
import {
  lookupSuperforecastingTrait,
  runSuperforecastingTrait,
  superforecastingTraitExample,
} from "./tool.js";

describe("superforecasting traits Tetlock team traits lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runSuperforecastingTrait(superforecastingTraitExample.input),
    ).toEqual({
      ok: true,
      output: superforecastingTraitExample.output,
    });
  });

  it("looks up diverse views", () => {
    expect(
      lookupSuperforecastingTrait({ trait: "diverseViews" }).teamPractice,
    ).toContain("before discussing");
  });

  it("looks up disciplined updating", () => {
    expect(
      lookupSuperforecastingTrait({ trait: "disciplinedUpdating" })
        .traitDefinition,
    ).toContain("rather than identity");
  });

  it("rejects an unsupported trait at the public boundary", () => {
    expect(runSuperforecastingTrait({ trait: "confidence" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "trait" }] },
      ok: false,
    });
  });
});
