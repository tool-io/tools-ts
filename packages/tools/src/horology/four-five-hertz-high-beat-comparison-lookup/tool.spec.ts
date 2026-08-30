import { describe, expect, it } from "vitest";
import {
  frequencyComparisonExample,
  lookupFourFiveHertzComparison,
  runFrequencyComparison,
} from "./tool.js";

describe("four-versus-five-hertz high-beat comparison lookup", () => {
  it("reproduces the canonical 36,000-vph 5 Hz fact", () => {
    expect(runFrequencyComparison(frequencyComparisonExample.input)).toEqual({
      ok: true,
      output: frequencyComparisonExample.output,
    });
  });

  it("maps 4 Hz to 28,800 vibrations per hour", () => {
    expect(
      lookupFourFiveHertzComparison({ frequencyFocus: "fourHertz" })
        .verifiedStatement,
    ).toContain("28,800");
  });

  it("records the power-reserve and longevity tradeoff", () => {
    expect(
      lookupFourFiveHertzComparison({ frequencyFocus: "powerTradeoff" })
        .verifiedStatement,
    ).toContain("power reserve and movement longevity");
  });

  it("does not guarantee better daily rate from frequency alone", () => {
    expect(
      lookupFourFiveHertzComparison({ frequencyFocus: "rateCaution" })
        .verifiedStatement,
    ).toContain("does not by itself guarantee");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(
      runFrequencyComparison({ frequencyFocus: "chronometer" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "frequencyFocus" }] },
      ok: false,
    });
  });
});
