import { describe, expect, it } from "vitest";
import {
  boundaryTermDetectorExample,
  runBoundaryTermDetector,
} from "./tool.js";

describe("boundary-term-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBoundaryTermDetector(boundaryTermDetectorExample.input)).toEqual({
      ok: true,
      output: boundaryTermDetectorExample.output,
    });
  });

  it("counts multiple matches and reports the first in original casing", () => {
    expect(
      runBoundaryTermDetector({ text: "termini fines constituti" }),
    ).toEqual({
      ok: true,
      output: {
        found: true,
        matchedTerm: "termini",
        normalizedTerm: "termini",
        matchCount: 2,
      },
    });
  });
  it("reports absence and rejects empty text", () => {
    expect(runBoundaryTermDetector({ text: "via miliaria" })).toEqual({
      ok: true,
      output: {
        found: false,
        matchedTerm: "",
        normalizedTerm: "",
        matchCount: 0,
      },
    });
    expect(runBoundaryTermDetector({ text: "   " }).ok).toBe(false);
  });
});
