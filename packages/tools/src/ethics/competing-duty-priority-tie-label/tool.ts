import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPriority: number;
  readonly secondPriority: number;
  readonly tolerance: number;
};
export type Output = { readonly tie: boolean; readonly preferred: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPriority: { type: "number" },
    secondPriority: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["firstPriority", "secondPriority", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tie: { type: "boolean" },
    preferred: { type: "string", maxLength: 8192 },
  },
  required: ["tie", "preferred"],
} as const;
/** Calculate competing duty priority tie label from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPriority, secondPriority, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      tie: Math.abs(firstPriority - secondPriority) <= tolerance,
      preferred:
        Math.abs(firstPriority - secondPriority) <= tolerance
          ? "tie"
          : firstPriority > secondPriority
            ? "first"
            : "second",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPriority: 3, secondPriority: 4, tolerance: 0.1 },
  output: { tie: false, preferred: "second" },
} satisfies ToolExample<Input, Output>;
export const competingDutyPriorityTieLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/competing-duty-priority-tie-label",
    title: "Competing Duty Priority Tie Label Tool",
    description:
      "Calculate competing duty priority tie label from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPriority: { type: "number" },
        secondPriority: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["firstPriority", "secondPriority", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tie: { type: "boolean" },
        preferred: { type: "string", maxLength: 8192 },
      },
      required: ["tie", "preferred"],
    },
    ports: {
      inputs: [
        {
          id: "firstPriority",
          label: "First Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPriority",
          label: "Second Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "tie", label: "Tie", valueType: { type: "boolean" } },
        { id: "preferred", label: "Preferred", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = competingDutyPriorityTieLabelTool.execute;
export default competingDutyPriorityTieLabelTool;
