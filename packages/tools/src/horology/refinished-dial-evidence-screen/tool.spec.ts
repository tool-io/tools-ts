import { describe, expect, it } from "vitest";
import {
  refinishedDialExample,
  runRefinishedDial,
  screenRefinishedDialEvidence,
} from "./tool.js";

describe("refinished-dial evidence screen", () => {
  it("reproduces the canonical confirmed-refinish example", () => {
    expect(runRefinishedDial(refinishedDialExample.input)).toEqual({
      ok: true,
      output: refinishedDialExample.output,
    });
  });

  it("prioritizes a confirmed replacement", () => {
    expect(
      screenRefinishedDialEvidence({
        documentationSupportsOriginalDial: false,
        replacementDialConfirmed: true,
        refinishedOriginalDialConfirmed: false,
      }).classification,
    ).toBe("confirmedReplacement");
  });

  it("classifies documentation-supported original evidence", () => {
    expect(
      screenRefinishedDialEvidence({
        documentationSupportsOriginalDial: true,
        replacementDialConfirmed: false,
        refinishedOriginalDialConfirmed: false,
      }).classification,
    ).toBe("supportedOriginal");
  });

  it("classifies no decisive evidence", () => {
    expect(
      screenRefinishedDialEvidence({
        documentationSupportsOriginalDial: false,
        replacementDialConfirmed: false,
        refinishedOriginalDialConfirmed: false,
      }).classification,
    ).toBe("insufficientEvidence");
  });

  it("rejects contradictory replacement and refinished-original evidence", () => {
    expect(
      runRefinishedDial({
        documentationSupportsOriginalDial: false,
        replacementDialConfirmed: true,
        refinishedOriginalDialConfirmed: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "contradictory_dial_evidence", field: "" }] },
      ok: false,
    });
  });
});
