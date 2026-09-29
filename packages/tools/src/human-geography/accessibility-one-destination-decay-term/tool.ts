import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opportunities: number;
  readonly travelTime: number;
  readonly decayRate: number;
  readonly weight: number;
};
export type Output = { readonly decay: number; readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opportunities: { type: "number", minimum: 0 },
    travelTime: { type: "number", minimum: 0 },
    decayRate: { type: "number", minimum: 0 },
    weight: { type: "number", minimum: 0 },
  },
  required: ["opportunities", "travelTime", "decayRate", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decay: { type: "number" }, contribution: { type: "number" } },
  required: ["decay", "contribution"],
} as const;
/** One exponentially time-decayed opportunity contribution with an explicit decay rate, not a network accessibility solution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opportunities, travelTime, decayRate, weight } = request;
  const compute = (): Output => {
    H.domain(
      opportunities >= 0 && travelTime >= 0 && decayRate >= 0 && weight >= 0,
    );
    return {
      decay: Math.exp(-decayRate * travelTime),
      contribution: opportunities * weight * Math.exp(-decayRate * travelTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opportunities: 100,
    travelTime: 10,
    decayRate: 0.06931471805599453,
    weight: 0.5,
  },
  output: { decay: 0.5, contribution: 25 },
} satisfies ToolExample<Input, Output>;
export const accessibilityOneDestinationDecayTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/accessibility-one-destination-decay-term",
      title: "Accessibility One Destination Decay Term Tool",
      description:
        "One exponentially time-decayed opportunity contribution with an explicit decay rate, not a network accessibility solution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opportunities: { type: "number", minimum: 0 },
          travelTime: { type: "number", minimum: 0 },
          decayRate: { type: "number", minimum: 0 },
          weight: { type: "number", minimum: 0 },
        },
        required: ["opportunities", "travelTime", "decayRate", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          decay: { type: "number" },
          contribution: { type: "number" },
        },
        required: ["decay", "contribution"],
      },
      ports: {
        inputs: [
          {
            id: "opportunities",
            label: "Opportunities",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "travelTime",
            label: "Travel Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "decayRate",
            label: "Decay Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "decay", label: "Decay", valueType: { type: "number" } },
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = accessibilityOneDestinationDecayTermTool.execute;
export default accessibilityOneDestinationDecayTermTool;
