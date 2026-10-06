import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialLiveWeight: number;
  readonly laterLiveWeight: number;
};
export type Output = {
  readonly weightLoss: number;
  readonly shrinkFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialLiveWeight: { type: "number", exclusiveMinimum: 0 },
    laterLiveWeight: { type: "number", minimum: 0 },
  },
  required: ["initialLiveWeight", "laterLiveWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightLoss: { type: "number" },
    shrinkFraction: { type: "number" },
  },
  required: ["weightLoss", "shrinkFraction"],
} as const;
/** Describe signed observed live-weight shrink relative to an initial measured weight without attributing its cause. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialLiveWeight, laterLiveWeight } = request;
  const compute = (): Output => {
    (H.domain(initialLiveWeight > 0, "initialLiveWeight"), initialLiveWeight);
    H.domain(laterLiveWeight >= 0, "laterLiveWeight");
    return {
      weightLoss: initialLiveWeight - laterLiveWeight,
      shrinkFraction: (initialLiveWeight - laterLiveWeight) / initialLiveWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialLiveWeight: 500, laterLiveWeight: 480 },
  output: { weightLoss: 20, shrinkFraction: 0.04 },
} satisfies ToolExample<Input, Output>;
export const livestockLiveWeightShrinkShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/livestock-live-weight-shrink-share",
    title: "Livestock Live Weight Shrink Share",
    description:
      "Describe signed observed live-weight shrink relative to an initial measured weight without attributing its cause.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialLiveWeight: { type: "number", exclusiveMinimum: 0 },
        laterLiveWeight: { type: "number", minimum: 0 },
      },
      required: ["initialLiveWeight", "laterLiveWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightLoss: { type: "number" },
        shrinkFraction: { type: "number" },
      },
      required: ["weightLoss", "shrinkFraction"],
    },
    ports: {
      inputs: [
        {
          id: "initialLiveWeight",
          label: "Initial Live Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laterLiveWeight",
          label: "Later Live Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightLoss",
          label: "Weight Loss",
          valueType: { type: "number" },
        },
        {
          id: "shrinkFraction",
          label: "Shrink Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockLiveWeightShrinkShareTool.execute;
export default livestockLiveWeightShrinkShareTool;
