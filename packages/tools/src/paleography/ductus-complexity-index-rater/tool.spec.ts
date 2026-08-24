import { describe, expect, it } from "vitest";
import {
  ductusComplexityIndexRaterExample,
  runDuctusComplexityIndexRater,
} from "./tool.js";

describe("ductus-complexity-index-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDuctusComplexityIndexRater(ductusComplexityIndexRaterExample.input),
    ).toEqual({
      ok: true,
      output: ductusComplexityIndexRaterExample.output,
    });
  });

  it("classes spare uncial ductus as economical", () => {
    const result = runDuctusComplexityIndexRater({
      strokeCount: 14,
      lettersMeasured: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.strokesPerLetter).toBe(2.8);
    expect(result.output.ductusBand).toBe("economical");
  });

  it("rejects an empty letter sample", () => {
    expect(
      runDuctusComplexityIndexRater({ strokeCount: 10, lettersMeasured: 0 }).ok,
    ).toBe(false);
  });
});
