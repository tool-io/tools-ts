import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftValue: number;
  readonly rightValue: number;
  readonly leftSlope: number;
  readonly rightSlope: number;
};
export type Output = { readonly valueGap: number; readonly slopeGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftValue: { type: "number" },
    rightValue: { type: "number" },
    leftSlope: { type: "number" },
    rightSlope: { type: "number" },
  },
  required: ["leftValue", "rightValue", "leftSlope", "rightSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valueGap: { type: "number" }, slopeGap: { type: "number" } },
  required: ["valueGap", "slopeGap"],
} as const;
/** Calculate hermite endpoint data continuity gap from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftValue, rightValue, leftSlope, rightSlope } = input;
  const compute = (): Output => {
    return {
      valueGap: rightValue - leftValue,
      slopeGap: rightSlope - leftSlope,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftValue: 2, rightValue: 3, leftSlope: 4, rightSlope: 6 },
  output: { valueGap: 1, slopeGap: 2 },
} satisfies ToolExample<Input, Output>;
export const hermiteEndpointDataContinuityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/hermite-endpoint-data-continuity-gap",
    title: "Hermite Endpoint Data Continuity Gap Tool",
    description:
      "Calculate hermite endpoint data continuity gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftValue: { type: "number" },
        rightValue: { type: "number" },
        leftSlope: { type: "number" },
        rightSlope: { type: "number" },
      },
      required: ["leftValue", "rightValue", "leftSlope", "rightSlope"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valueGap: { type: "number" },
        slopeGap: { type: "number" },
      },
      required: ["valueGap", "slopeGap"],
    },
    ports: {
      inputs: [
        {
          id: "leftValue",
          label: "Left Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightValue",
          label: "Right Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftSlope",
          label: "Left Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightSlope",
          label: "Right Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "valueGap", label: "Value Gap", valueType: { type: "number" } },
        { id: "slopeGap", label: "Slope Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hermiteEndpointDataContinuityGapTool.execute;
export default hermiteEndpointDataContinuityGapTool;
