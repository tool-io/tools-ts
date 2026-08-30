import { describe, expect, it } from "vitest";
import {
  classifyWeb3ForecastSpectrum,
  runWeb3ForecastSpectrum,
  web3ForecastSpectrumExample,
} from "./tool.js";

describe("Web3 crypto forecast spectrum lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runWeb3ForecastSpectrum(web3ForecastSpectrumExample.input)).toEqual({
      ok: true,
      output: web3ForecastSpectrumExample.output,
    });
  });

  it("classifies a critical spectrum", () => {
    expect(
      classifyWeb3ForecastSpectrum({
        adoptionScore: 20,
        governanceScore: 20,
        rightsScore: 20,
        utilityScore: 20,
      }).spectrumPosition,
    ).toBe("critical");
  });

  it("classifies a pragmatic spectrum", () => {
    expect(
      classifyWeb3ForecastSpectrum({
        adoptionScore: 60,
        governanceScore: 60,
        rightsScore: 60,
        utilityScore: 60,
      }).spectrumPosition,
    ).toBe("pragmatic");
  });

  it("rejects a score above 100", () => {
    expect(
      runWeb3ForecastSpectrum({
        adoptionScore: 101,
        governanceScore: 0,
        rightsScore: 0,
        utilityScore: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "adoptionScore" }],
      },
      ok: false,
    });
  });
});
