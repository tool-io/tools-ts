import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly completedPercent: number };
export type Output = { readonly remainingPercent: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedPercent: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["completedPercent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingPercent: { type: "number" } },
  required: ["remainingPercent"],
} as const;
/** Return the complement of an explicitly supplied milestone progress percentage without estimating progress. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completedPercent } = request;
  const compute = (): Output => {
    H.domain(
      completedPercent >= 0 && completedPercent <= 100,
      "completedPercent",
    );
    return { remainingPercent: 100 - completedPercent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completedPercent: 65 },
  output: { remainingPercent: 35 },
} satisfies ToolExample<Input, Output>;
export const milestoneProgressRemainingPercentTool = H.defineSchemaCalculation<
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
    id: "management/milestone-progress-remaining-percent",
    title: "Milestone Progress Remaining Percent",
    description:
      "Return the complement of an explicitly supplied milestone progress percentage without estimating progress.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedPercent: { type: "number", minimum: 0, maximum: 100 },
      },
      required: ["completedPercent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingPercent: { type: "number" } },
      required: ["remainingPercent"],
    },
    ports: {
      inputs: [
        {
          id: "completedPercent",
          label: "Completed Percent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingPercent",
          label: "Remaining Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milestoneProgressRemainingPercentTool.execute;
export default milestoneProgressRemainingPercentTool;
