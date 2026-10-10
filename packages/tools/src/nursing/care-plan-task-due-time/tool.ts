import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedDueSeconds: number;
  readonly asOfSeconds: number;
};
export type Output = {
  readonly remainingSeconds: number;
  readonly overdue: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedDueSeconds: { type: "number" },
    asOfSeconds: { type: "number" },
  },
  required: ["plannedDueSeconds", "asOfSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingSeconds: { type: "number" },
    overdue: { type: "boolean" },
  },
  required: ["remainingSeconds", "overdue"],
} as const;
/** Compare an explicit care-plan due timestamp with supplied as-of time without selecting a task deadline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedDueSeconds, asOfSeconds } = request;
  const compute = (): Output => {
    return {
      remainingSeconds: plannedDueSeconds - asOfSeconds,
      overdue: asOfSeconds > plannedDueSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedDueSeconds: 600, asOfSeconds: 500 },
  output: { remainingSeconds: 100, overdue: false },
} satisfies ToolExample<Input, Output>;
export const carePlanTaskDueTimeTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["nursing", "health and medicine"],
        keywords: ["nursing", "health and medicine"],
      },
      id: "nursing/care-plan-task-due-time",
      title: "Care Plan Task Due Time",
      description:
        "Compare an explicit care-plan due timestamp with supplied as-of time without selecting a task deadline.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plannedDueSeconds: { type: "number" },
          asOfSeconds: { type: "number" },
        },
        required: ["plannedDueSeconds", "asOfSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remainingSeconds: { type: "number" },
          overdue: { type: "boolean" },
        },
        required: ["remainingSeconds", "overdue"],
      },
      ports: {
        inputs: [
          {
            id: "plannedDueSeconds",
            label: "Planned Due Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "asOfSeconds",
            label: "As Of Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remainingSeconds",
            label: "Remaining Seconds",
            valueType: { type: "number" },
          },
          { id: "overdue", label: "Overdue", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  },
);
export const run = carePlanTaskDueTimeTool.execute;
export default carePlanTaskDueTimeTool;
