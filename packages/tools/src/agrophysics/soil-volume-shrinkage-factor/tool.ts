import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly finalVolume: number;
};
export type Output = {
  readonly retainedFactor: number;
  readonly shrinkageFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number", minimum: 0 },
  },
  required: ["initialVolume", "finalVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedFactor: { type: "number" },
    shrinkageFraction: { type: "number" },
  },
  required: ["retainedFactor", "shrinkageFraction"],
} as const;
/** Compare measured volume states; negative shrinkage represents observed expansion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, finalVolume } = request;
  const compute = (): Output => {
    H.positive(initialVolume);
    H.domain(finalVolume >= 0);
    return {
      retainedFactor: finalVolume / initialVolume,
      shrinkageFraction: (initialVolume - finalVolume) / initialVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialVolume: 10, finalVolume: 8 },
  output: { retainedFactor: 0.8, shrinkageFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const soilVolumeShrinkageFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-volume-shrinkage-factor",
    title: "Soil Volume Shrinkage Factor Tool",
    description:
      "Compare measured volume states; negative shrinkage represents observed expansion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number", minimum: 0 },
      },
      required: ["initialVolume", "finalVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedFactor: { type: "number" },
        shrinkageFraction: { type: "number" },
      },
      required: ["retainedFactor", "shrinkageFraction"],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "retainedFactor",
          label: "Retained Factor",
          valueType: { type: "number" },
        },
        {
          id: "shrinkageFraction",
          label: "Shrinkage Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilVolumeShrinkageFactorTool.execute;
export default soilVolumeShrinkageFactorTool;
