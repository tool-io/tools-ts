import { describe, expect, it } from "vitest";
import {
  chainLineSpacingClassifierExample,
  runChainLineSpacingClassifier,
} from "./tool.js";

describe("chain-line-spacing-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChainLineSpacingClassifier(chainLineSpacingClassifierExample.input),
    ).toEqual({ ok: true, output: chainLineSpacingClassifierExample.output });
  });

  it("flags a tight stock below the supplied range", () => {
    const result = runChainLineSpacingClassifier({
      rangeLowerMm: 25,
      rangeUpperMm: 35,
      spacingMm: 18,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.classification as string).toBe("below_lower_bound");
  });

  it("rejects an inverted range", () => {
    expect(
      runChainLineSpacingClassifier({
        rangeLowerMm: 35,
        rangeUpperMm: 25,
        spacingMm: 28,
      }).ok,
    ).toBe(false);
  });
});
