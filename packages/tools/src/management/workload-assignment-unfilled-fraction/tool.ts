import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unfilledWorkHours: number;
  readonly totalRequiredHours: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unfilledWorkHours: { type: "number", minimum: 0 },
    totalRequiredHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["unfilledWorkHours", "totalRequiredHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize explicitly unfilled work hours to a supplied compatible total required workload. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unfilledWorkHours, totalRequiredHours } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalRequiredHours) && totalRequiredHours > 0,
      "totalRequiredHours",
    ),
      totalRequiredHours);
    H.domain(
      unfilledWorkHours >= 0 && unfilledWorkHours <= totalRequiredHours,
      "unfilledWorkHours",
    );
    return {
      fraction: unfilledWorkHours / totalRequiredHours,
      remainder: totalRequiredHours - unfilledWorkHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unfilledWorkHours: 30, totalRequiredHours: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const workloadAssignmentUnfilledFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/workload-assignment-unfilled-fraction",
    title: "Workload Assignment Unfilled Fraction",
    description:
      "Normalize explicitly unfilled work hours to a supplied compatible total required workload.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unfilledWorkHours: { type: "number", minimum: 0 },
        totalRequiredHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["unfilledWorkHours", "totalRequiredHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "unfilledWorkHours",
          label: "Unfilled Work Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalRequiredHours",
          label: "Total Required Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = workloadAssignmentUnfilledFractionTool.execute;
export default workloadAssignmentUnfilledFractionTool;
