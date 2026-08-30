import { describe, expect, it } from "vitest";
import {
  checkTechFramingBias,
  runTechFramingBias,
  techFramingBiasExample,
} from "./tool.js";

describe("utopian dystopian technology framing bias checker", () => {
  it("reproduces its canonical example", () => {
    expect(runTechFramingBias(techFramingBiasExample.input)).toEqual({
      ok: true,
      output: techFramingBiasExample.output,
    });
  });

  it("detects a utopian-only evidence set", () => {
    expect(
      checkTechFramingBias({ evidenceFrames: ["utopian", "utopian"] }),
    ).toMatchObject({
      balancedEvidenceRequired: true,
      oneSidedFraming: true,
    });
  });

  it("normalizes frame casing", () => {
    expect(
      checkTechFramingBias({ evidenceFrames: [" UTOPIAN ", "DYSTOPIAN"] }),
    ).toMatchObject({
      balancedEvidenceRequired: false,
      dominantFrame: "utopian",
    });
  });

  it("rejects an unknown evidence frame", () => {
    expect(runTechFramingBias({ evidenceFrames: ["mixed"] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_evidence_frame", field: "evidenceFrames.0" }],
      },
      ok: false,
    });
  });
});
