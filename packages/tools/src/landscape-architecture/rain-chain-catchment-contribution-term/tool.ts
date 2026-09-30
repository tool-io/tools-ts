import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roofArea: number;
  readonly contributionFraction: number;
  readonly rainfallDepth: number;
  readonly runoffFraction: number;
};
export type Output = {
  readonly contributingArea: number;
  readonly runoffVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roofArea: { type: "number", minimum: 0 },
    contributionFraction: { type: "number", minimum: 0, maximum: 1 },
    rainfallDepth: { type: "number", minimum: 0 },
    runoffFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "roofArea",
    "contributionFraction",
    "rainfallDepth",
    "runoffFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributingArea: { type: "number" },
    runoffVolume: { type: "number" },
  },
  required: ["contributingArea", "runoffVolume"],
} as const;
/** Calculate rain chain catchment contribution term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roofArea, contributionFraction, rainfallDepth, runoffFraction } =
    request;
  const compute = (): Output => {
    H.domain(roofArea >= 0 && rainfallDepth >= 0);
    H.probability(contributionFraction);
    H.probability(runoffFraction);
    return {
      contributingArea: roofArea * contributionFraction,
      runoffVolume:
        roofArea * contributionFraction * rainfallDepth * runoffFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roofArea: 100,
    contributionFraction: 0.25,
    rainfallDepth: 0.02,
    runoffFraction: 0.8,
  },
  output: { contributingArea: 25, runoffVolume: 0.4 },
} satisfies ToolExample<Input, Output>;
export const rainChainCatchmentContributionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/rain-chain-catchment-contribution-term",
    title: "Rain Chain Catchment Contribution Term Tool",
    description:
      "Calculate rain chain catchment contribution term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roofArea: { type: "number", minimum: 0 },
        contributionFraction: { type: "number", minimum: 0, maximum: 1 },
        rainfallDepth: { type: "number", minimum: 0 },
        runoffFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "roofArea",
        "contributionFraction",
        "rainfallDepth",
        "runoffFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributingArea: { type: "number" },
        runoffVolume: { type: "number" },
      },
      required: ["contributingArea", "runoffVolume"],
    },
    ports: {
      inputs: [
        {
          id: "roofArea",
          label: "Roof Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contributionFraction",
          label: "Contribution Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rainfallDepth",
          label: "Rainfall Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "runoffFraction",
          label: "Runoff Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contributingArea",
          label: "Contributing Area",
          valueType: { type: "number" },
        },
        {
          id: "runoffVolume",
          label: "Runoff Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rainChainCatchmentContributionTermTool.execute;
export default rainChainCatchmentContributionTermTool;
