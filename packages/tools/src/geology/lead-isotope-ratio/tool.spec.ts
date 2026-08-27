import { describe, expect, it } from "vitest";
import {
  calculateLeadIsotopeRatio,
  leadIsotopeRatioExample,
  runLeadIsotopeRatio,
} from "./tool.js";

describe("lead-isotope-ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLeadIsotopeRatio(leadIsotopeRatioExample.input)).toEqual({
      ok: true,
      output: leadIsotopeRatioExample.output,
    });
  });

  it("scales linearly with a common multiplier", () => {
    const doubled = calculateLeadIsotopeRatio({
      pb204: 2,
      pb206: 36.2,
      pb207: 31.26,
      pb208: 77.2,
    });
    expect(doubled).toEqual(leadIsotopeRatioExample.output);
  });

  it("rejects non-positive 204Pb", () => {
    expect(
      runLeadIsotopeRatio({ pb204: 0, pb206: 1, pb207: 1, pb208: 1 }).ok,
    ).toBe(false);
  });
});
