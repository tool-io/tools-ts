import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly demonstrationFlags: readonly boolean[] };
export type Output = {
  readonly demonstrations: number;
  readonly totalEvents: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demonstrationFlags: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["demonstrationFlags"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demonstrations: { type: "integer" },
    totalEvents: { type: "integer" },
  },
  required: ["demonstrations", "totalEvents"],
} as const;
/** Count explicit demonstration flags in a supplied developmental-task event list without judging learning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { demonstrationFlags } = request;
  const compute = (): Output => {
    return {
      demonstrations: demonstrationFlags.filter(Boolean).length,
      totalEvents: demonstrationFlags.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { demonstrationFlags: [true, false, true] },
  output: { demonstrations: 2, totalEvents: 3 },
} satisfies ToolExample<Input, Output>;
export const developmentalTaskDemonstrationCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/developmental-task-demonstration-count",
      title: "Developmental Task Demonstration Count Tool",
      description:
        "Count explicit demonstration flags in a supplied developmental-task event list without judging learning.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          demonstrationFlags: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["demonstrationFlags"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          demonstrations: { type: "integer" },
          totalEvents: { type: "integer" },
        },
        required: ["demonstrations", "totalEvents"],
      },
      ports: {
        inputs: [
          {
            id: "demonstrationFlags",
            label: "Demonstration Flags",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "demonstrations",
            label: "Demonstrations",
            valueType: { type: "integer" },
          },
          {
            id: "totalEvents",
            label: "Total Events",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalTaskDemonstrationCountTool.execute;
export default developmentalTaskDemonstrationCountTool;
