import { describe, expect, it } from "vitest";
import {
  checkWalkthroughConventions,
  runWalkthroughConventions,
  walkthroughConventionExample,
} from "./tool.js";

describe("walkthrough narrative flowchart conventions", () => {
  it("reproduces its canonical example", () => {
    expect(
      runWalkthroughConventions(walkthroughConventionExample.input),
    ).toEqual({
      ok: true,
      output: walkthroughConventionExample.output,
    });
  });

  it("reports complete documentation", () => {
    expect(
      checkWalkthroughConventions({
        controlActivities: true,
        exceptionHandling: true,
        inputs: true,
        outputs: true,
        processOwner: true,
        purpose: true,
      }),
    ).toMatchObject({
      complete: true,
      completedCount: 6,
      missingConventions: [],
    });
  });

  it("reports every missing convention in stable order", () => {
    expect(
      checkWalkthroughConventions({
        controlActivities: false,
        exceptionHandling: false,
        inputs: false,
        outputs: true,
        processOwner: false,
        purpose: false,
      }).missingConventions,
    ).toEqual([
      "process owner",
      "purpose",
      "inputs",
      "control activities",
      "exception handling",
    ]);
  });

  it("rejects malformed convention input", () => {
    expect(
      runWalkthroughConventions({
        controlActivities: 1,
        exceptionHandling: true,
        inputs: true,
        outputs: true,
        processOwner: true,
        purpose: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "controlActivities" }],
      },
      ok: false,
    });
  });
});
