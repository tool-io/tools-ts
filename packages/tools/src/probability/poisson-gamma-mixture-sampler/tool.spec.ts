import { describe, expect, it } from "vitest";
import {
  poissonGammaMixtureExample,
  runPoissonGammaMixture,
  samplePoissonGammaMixture,
} from "./tool.js";

describe("Poisson-Gamma Mixture Sampler", () => {
  it("produces nonnegative integer counts", () =>
    expect(
      samplePoissonGammaMixture(3, 2, 20, "seed")?.every(
        (value) => Number.isInteger(value) && value >= 0,
      ),
    ).toBe(true));
  it("publishes an executable example", () =>
    expect(runPoissonGammaMixture(poissonGammaMixtureExample.input)).toEqual({
      ok: true,
      output: poissonGammaMixtureExample.output,
    }));
});
