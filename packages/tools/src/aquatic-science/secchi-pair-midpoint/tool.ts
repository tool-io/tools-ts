import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly disappearanceDepthMeters: number;
  readonly reappearanceDepthMeters: number;
};
export type Output = {
  readonly meanDepthMeters: number;
  readonly pairDifferenceMeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disappearanceDepthMeters: { type: "number", minimum: 0 },
    reappearanceDepthMeters: { type: "number", minimum: 0 },
  },
  required: ["disappearanceDepthMeters", "reappearanceDepthMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanDepthMeters: { type: "number" },
    pairDifferenceMeters: { type: "number" },
  },
  required: ["meanDepthMeters", "pairDifferenceMeters"],
} as const;
/** Average a supplied Secchi disappearance/reappearance depth pair and retain its signed difference without estimating water quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disappearanceDepthMeters, reappearanceDepthMeters } = request;
  const compute = (): Output => {
    H.domain(
      disappearanceDepthMeters >= 0 && reappearanceDepthMeters >= 0,
      "disappearanceDepthMeters",
    );
    return {
      meanDepthMeters:
        disappearanceDepthMeters / 2 + reappearanceDepthMeters / 2,
      pairDifferenceMeters: disappearanceDepthMeters - reappearanceDepthMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disappearanceDepthMeters: 2.4, reappearanceDepthMeters: 2 },
  output: { meanDepthMeters: 2.2, pairDifferenceMeters: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const secchiPairMidpointTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/secchi-pair-midpoint",
    title: "Secchi Pair Midpoint",
    description:
      "Average a supplied Secchi disappearance/reappearance depth pair and retain its signed difference without estimating water quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disappearanceDepthMeters: { type: "number", minimum: 0 },
        reappearanceDepthMeters: { type: "number", minimum: 0 },
      },
      required: ["disappearanceDepthMeters", "reappearanceDepthMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanDepthMeters: { type: "number" },
        pairDifferenceMeters: { type: "number" },
      },
      required: ["meanDepthMeters", "pairDifferenceMeters"],
    },
    ports: {
      inputs: [
        {
          id: "disappearanceDepthMeters",
          label: "Disappearance Depth Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reappearanceDepthMeters",
          label: "Reappearance Depth Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanDepthMeters",
          label: "Mean Depth Meters",
          valueType: { type: "number" },
        },
        {
          id: "pairDifferenceMeters",
          label: "Pair Difference Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = secchiPairMidpointTool.execute;
export default secchiPairMidpointTool;
