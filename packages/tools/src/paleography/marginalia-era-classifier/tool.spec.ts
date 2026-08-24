import { describe, expect, it } from "vitest";
import {
  marginaliaEraClassifierExample,
  runMarginaliaEraClassifier,
} from "./tool.js";

describe("marginalia-era-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMarginaliaEraClassifier(marginaliaEraClassifierExample.input),
    ).toEqual({
      ok: true,
      output: marginaliaEraClassifierExample.output,
    });
  });

  it("flags secretary marginalia as anachronistic in a twelfth-century book", () => {
    const result = runMarginaliaEraClassifier({
      scriptHand: "secretary",
      century: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.matchesGivenCentury).toBe(false);
    expect(result.output.currencyFromCentury).toBe(15);
    expect(result.output.currencyToCentury).toBe(17);
  });

  it("rejects non-positive supplied centuries", () => {
    expect(
      runMarginaliaEraClassifier({ scriptHand: "gothic_cursive", century: -3 })
        .ok,
    ).toBe(false);
  });
});
