import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDistance: number;
  readonly secondDistance: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDistance: { type: "number", minimum: 0 },
    secondDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstDistance", "secondDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Compare supplied landmark distances without species-specific morphology thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDistance, secondDistance } = request;
  const compute = (): Output => {
    H.domain(firstDistance >= 0);
    H.positive(secondDistance);
    return { ratio: firstDistance / secondDistance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDistance: 3, secondDistance: 4 },
  output: { ratio: 0.75 },
} satisfies ToolExample<Input, Output>;
export const bodyLandmarkDistanceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/body-landmark-distance-ratio",
    title: "Body Landmark Distance Ratio Tool",
    description:
      "Compare supplied landmark distances without species-specific morphology thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDistance: { type: "number", minimum: 0 },
        secondDistance: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstDistance", "secondDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstDistance",
          label: "First Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDistance",
          label: "Second Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = bodyLandmarkDistanceRatioTool.execute;
export default bodyLandmarkDistanceRatioTool;
