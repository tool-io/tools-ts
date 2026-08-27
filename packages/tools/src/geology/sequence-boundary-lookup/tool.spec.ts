import { describe, expect, it } from "vitest";
import {
  runSequenceBoundaryLookup,
  sequenceBoundaryLookupExample,
} from "./tool.js";

describe("sequence-boundary-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSequenceBoundaryLookup(sequenceBoundaryLookupExample.input),
    ).toEqual({
      ok: true,
      output: sequenceBoundaryLookupExample.output,
    });
  });

  it("rates erosional truncation as diagnostic below the boundary", () => {
    const result = runSequenceBoundaryLookup({
      observedFeature: "erosional-truncation",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.diagnosticWeight as string).toBe("diagnostic");
    expect(result.output.position as string).toBe("below the boundary");
  });

  it("rejects unknown features", () => {
    expect(
      runSequenceBoundaryLookup({ observedFeature: "hummocky-clinoform" }).ok,
    ).toBe(false);
  });
});
