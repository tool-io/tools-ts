import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly slope: number;
  readonly sourceTimeInTargetUnits: number;
};
export type Output = { readonly convertedSlope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slope: { type: "number" },
    sourceTimeInTargetUnits: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["slope", "sourceTimeInTargetUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedSlope: { type: "number" } },
  required: ["convertedSlope"],
} as const;
/** Convert a supplied nonclinical per-time slope using an explicit source-to-target elapsed-time ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { slope, sourceTimeInTargetUnits } = request;
  const compute = (): Output => {
    H.positive(sourceTimeInTargetUnits);
    return { convertedSlope: slope / sourceTimeInTargetUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { slope: -2, sourceTimeInTargetUnits: 60 },
  output: { convertedSlope: -0.03333333333333333 },
} satisfies ToolExample<Input, Output>;
export const terminalSlopeTimeUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/terminal-slope-time-unit-factor",
    title: "Terminal Slope Time Unit Factor Tool",
    description:
      "Convert a supplied nonclinical per-time slope using an explicit source-to-target elapsed-time ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slope: { type: "number" },
        sourceTimeInTargetUnits: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["slope", "sourceTimeInTargetUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedSlope: { type: "number" } },
      required: ["convertedSlope"],
    },
    ports: {
      inputs: [
        {
          id: "slope",
          label: "Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceTimeInTargetUnits",
          label: "Source Time In Target Units",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedSlope",
          label: "Converted Slope",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = terminalSlopeTimeUnitFactorTool.execute;
export default terminalSlopeTimeUnitFactorTool;
