import { describe, expect, it } from "vitest";
import {
  betaBinomialExample,
  runBetaBinomial,
  sampleBetaBinomial,
} from "./tool.js";

describe("Beta-Binomial Sampler", () => {
  it("keeps successes within the trial count", () =>
    expect(
      sampleBetaBinomial(10, 2, 5, 20, "seed")?.every(
        (value) => value >= 0 && value <= 10,
      ),
    ).toBe(true));
  it("publishes an executable example", () =>
    expect(runBetaBinomial(betaBinomialExample.input)).toEqual({
      ok: true,
      output: betaBinomialExample.output,
    }));
});
