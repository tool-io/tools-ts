import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedDurationMinutes: number;
  readonly actualDurationMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedDurationMinutes: { type: "number" },
    actualDurationMinutes: { type: "number" },
  },
  required: ["plannedDurationMinutes", "actualDurationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit planned task duration from actual duration in minutes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedDurationMinutes, actualDurationMinutes } = request;
  const compute = (): Output => {
    return { signedGap: actualDurationMinutes - plannedDurationMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedDurationMinutes: 12, actualDurationMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const farmTaskActualplannedTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroinformatics", "agriculture"],
      keywords: ["agroinformatics", "agriculture"],
    },
    id: "agroinformatics/farm-task-actual-planned-time-gap",
    title: "Farm Task Actual Planned Time Gap",
    description:
      "Subtract explicit planned task duration from actual duration in minutes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedDurationMinutes: { type: "number" },
        actualDurationMinutes: { type: "number" },
      },
      required: ["plannedDurationMinutes", "actualDurationMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "plannedDurationMinutes",
          label: "Planned Duration Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualDurationMinutes",
          label: "Actual Duration Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmTaskActualplannedTimeGapTool.execute;
export default farmTaskActualplannedTimeGapTool;
