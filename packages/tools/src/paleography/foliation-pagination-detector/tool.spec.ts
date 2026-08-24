import { describe, expect, it } from "vitest";
import {
  foliationPaginationDetectorExample,
  runFoliationPaginationDetector,
} from "./tool.js";

describe("foliation-pagination-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFoliationPaginationDetector(foliationPaginationDetectorExample.input),
    ).toEqual({ ok: true, output: foliationPaginationDetectorExample.output });
  });

  it("halves an even paginated maximum into leaves", () => {
    const result = runFoliationPaginationDetector({
      observedHighest: 200,
      scheme: "pagination",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.actualLeafCount as number).toBe(100);
    expect(result.output.numbersWrittenPerLeaf as number).toBe(2);
  });

  it("allows an odd final page on the recto of the last leaf", () => {
    expect(
      runFoliationPaginationDetector({
        observedHighest: 101,
        scheme: "pagination",
      }),
    ).toEqual({
      ok: true,
      output: {
        actualLeafCount: 51,
        actualPageCount: 102,
        numbersWrittenPerLeaf: 2,
      },
    });
  });

  it("rejects fractional numbering", () => {
    expect(runFoliationPaginationDetector({ observedHighest: 10.5 }).ok).toBe(
      false,
    );
  });

  it("rejects an implied page total beyond the safe-integer range", () => {
    expect(
      runFoliationPaginationDetector({
        observedHighest: Number.MAX_SAFE_INTEGER,
      }).ok,
    ).toBe(false);
  });
});
