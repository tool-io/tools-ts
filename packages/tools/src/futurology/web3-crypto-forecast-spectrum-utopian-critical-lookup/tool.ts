import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Web3ForecastSpectrumInput = {
  readonly adoptionScore: number;
  readonly governanceScore: number;
  readonly rightsScore: number;
  readonly utilityScore: number;
};

export type Web3ForecastSpectrumOutput = {
  readonly spectrumPosition:
    "critical" | "utopian" | "pragmatic" | "speculative";
  readonly spectrumScore: number;
  readonly spectrumRationale: string;
};

export const classifyWeb3ForecastSpectrum = (
  input: Web3ForecastSpectrumInput,
): Web3ForecastSpectrumOutput => {
  for (const [field, value] of [
    ["adoptionScore", input.adoptionScore],
    ["utilityScore", input.utilityScore],
    ["governanceScore", input.governanceScore],
    ["rightsScore", input.rightsScore],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Spectrum scores must be finite values from 0 through 100.",
        "spectrum_score_out_of_range",
      );
  const spectrumScore =
    (input.adoptionScore +
      input.utilityScore +
      input.governanceScore +
      input.rightsScore) /
    4;
  return {
    spectrumPosition:
      spectrumScore >= 75
        ? "utopian"
        : spectrumScore <= 35
          ? "critical"
          : spectrumScore >= 60
            ? "pragmatic"
            : "speculative",
    spectrumScore,
    spectrumRationale:
      "The position summarizes adoption, utility, governance, and rights evidence; it is not a price forecast or endorsement.",
  };
};

export const web3ForecastSpectrumExample = {
  input: {
    adoptionScore: 80,
    governanceScore: 70,
    rightsScore: 75,
    utilityScore: 85,
  },
  output: {
    spectrumPosition: "utopian",
    spectrumScore: 77.5,
    spectrumRationale:
      "The position summarizes adoption, utility, governance, and rights evidence; it is not a price forecast or endorsement.",
  },
} satisfies ToolExample<Web3ForecastSpectrumInput, Web3ForecastSpectrumOutput>;

export const web3ForecastSpectrumTool = createSimpleTool({
  calculate: (input) =>
    classifyWeb3ForecastSpectrum({
      adoptionScore: input.adoptionScore as number,
      governanceScore: input.governanceScore as number,
      rightsScore: input.rightsScore as number,
      utilityScore: input.utilityScore as number,
    }),
  description:
    "Place a Web3 forecast on a caller-scored pragmatic, utopian, speculative, or critical spectrum without making a price prediction.",
  id: "futurology/web3-crypto-forecast-spectrum-utopian-critical-lookup",
  inputs: [
    {
      id: "adoptionScore",
      kind: "number",
      label: "Adoption score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "governanceScore",
      kind: "number",
      label: "Governance score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "rightsScore",
      kind: "number",
      label: "Rights score",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "utilityScore",
      kind: "number",
      label: "Utility score",
      maximum: 100,
      minimum: 0,
    },
  ],
  outputs: [
    {
      enum: ["critical", "speculative", "pragmatic", "utopian"],
      id: "spectrumPosition",
      kind: "string",
      label: "Forecast spectrum",
    },
    {
      id: "spectrumScore",
      kind: "number",
      label: "Spectrum score",
      maximum: 100,
      minimum: 0,
    },
    { id: "spectrumRationale", kind: "string", label: "Spectrum rationale" },
  ],
  title: "Web3 Crypto Forecast Spectrum Utopian Critical Lookup",
});

export const runWeb3ForecastSpectrum = web3ForecastSpectrumTool.execute;
export default web3ForecastSpectrumTool;
