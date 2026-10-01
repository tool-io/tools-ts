import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedValue: number;
  readonly sourceVolumeInTarget: number;
  readonly targetTimeUnitsPerSourceTime: number;
};
export type Output = { readonly converted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedValue: { type: "number" },
    sourceVolumeInTarget: { type: "number", exclusiveMinimum: 0 },
    targetTimeUnitsPerSourceTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "reportedValue",
    "sourceVolumeInTarget",
    "targetTimeUnitsPerSourceTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { converted: { type: "number" } },
  required: ["converted"],
} as const;
/** Convert supplied nonclinical volume-per-time units using explicit unit sizes without estimating clearance or adjusting treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedValue, sourceVolumeInTarget, targetTimeUnitsPerSourceTime } =
    request;
  const compute = (): Output => {
    H.positive(sourceVolumeInTarget);
    H.positive(targetTimeUnitsPerSourceTime);
    return {
      converted:
        (reportedValue * sourceVolumeInTarget) / targetTimeUnitsPerSourceTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedValue: 60,
    sourceVolumeInTarget: 1,
    targetTimeUnitsPerSourceTime: 60,
  },
  output: { converted: 1 },
} satisfies ToolExample<Input, Output>;
export const researchClearanceUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/research-clearance-unit-factor",
    title: "Research Clearance Unit Factor Tool",
    description:
      "Convert supplied nonclinical volume-per-time units using explicit unit sizes without estimating clearance or adjusting treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedValue: { type: "number" },
        sourceVolumeInTarget: { type: "number", exclusiveMinimum: 0 },
        targetTimeUnitsPerSourceTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "reportedValue",
        "sourceVolumeInTarget",
        "targetTimeUnitsPerSourceTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { converted: { type: "number" } },
      required: ["converted"],
    },
    ports: {
      inputs: [
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceVolumeInTarget",
          label: "Source Volume In Target",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetTimeUnitsPerSourceTime",
          label: "Target Time Units Per Source Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "converted", label: "Converted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchClearanceUnitFactorTool.execute;
export default researchClearanceUnitFactorTool;
