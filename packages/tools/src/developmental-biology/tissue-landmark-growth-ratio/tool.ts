import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialLandmarkDistance: number;
  readonly laterLandmarkDistance: number;
};
export type Output = {
  readonly growthRatio: number;
  readonly fractionalChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialLandmarkDistance: { type: "number", exclusiveMinimum: 0 },
    laterLandmarkDistance: { type: "number", minimum: 0 },
  },
  required: ["initialLandmarkDistance", "laterLandmarkDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    growthRatio: { type: "number" },
    fractionalChange: { type: "number" },
  },
  required: ["growthRatio", "fractionalChange"],
} as const;
/** Compare an explicitly measured tissue-landmark distance pair without attributing the change to a growth mechanism. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialLandmarkDistance, laterLandmarkDistance } = request;
  const compute = (): Output => {
    (H.domain(initialLandmarkDistance > 0, "initialLandmarkDistance"),
      initialLandmarkDistance);
    H.domain(laterLandmarkDistance >= 0, "laterLandmarkDistance");
    return {
      growthRatio: laterLandmarkDistance / initialLandmarkDistance,
      fractionalChange:
        (laterLandmarkDistance - initialLandmarkDistance) /
        initialLandmarkDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialLandmarkDistance: 10, laterLandmarkDistance: 12 },
  output: { growthRatio: 1.2, fractionalChange: 0.2 },
} satisfies ToolExample<Input, Output>;
export const tissueLandmarkGrowthRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/tissue-landmark-growth-ratio",
    title: "Tissue Landmark Growth Ratio",
    description:
      "Compare an explicitly measured tissue-landmark distance pair without attributing the change to a growth mechanism.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialLandmarkDistance: { type: "number", exclusiveMinimum: 0 },
        laterLandmarkDistance: { type: "number", minimum: 0 },
      },
      required: ["initialLandmarkDistance", "laterLandmarkDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        growthRatio: { type: "number" },
        fractionalChange: { type: "number" },
      },
      required: ["growthRatio", "fractionalChange"],
    },
    ports: {
      inputs: [
        {
          id: "initialLandmarkDistance",
          label: "Initial Landmark Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laterLandmarkDistance",
          label: "Later Landmark Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "growthRatio",
          label: "Growth Ratio",
          valueType: { type: "number" },
        },
        {
          id: "fractionalChange",
          label: "Fractional Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueLandmarkGrowthRatioTool.execute;
export default tissueLandmarkGrowthRatioTool;
