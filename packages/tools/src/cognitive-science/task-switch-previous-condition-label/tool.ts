import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCondition: string;
  readonly currentCondition: string;
};
export type Output = { readonly classification: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCondition: { type: "string", maxLength: 8192, minLength: 1 },
    currentCondition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["previousCondition", "currentCondition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { classification: { type: "string", maxLength: 8192 } },
  required: ["classification"],
} as const;
/** Label an adjacent explicit condition pair as a task repeat or switch without deriving a switch cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCondition, currentCondition } = request;
  const compute = (): Output => {
    H.domain(
      previousCondition.length > 0 && currentCondition.length > 0,
      "previousCondition",
    );
    return {
      classification:
        previousCondition === currentCondition ? "repeat" : "switch",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCondition: "A", currentCondition: "B" },
  output: { classification: "switch" },
} satisfies ToolExample<Input, Output>;
export const taskSwitchPreviousConditionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/task-switch-previous-condition-label",
    title: "Task Switch Previous Condition Label",
    description:
      "Label an adjacent explicit condition pair as a task repeat or switch without deriving a switch cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCondition: { type: "string", maxLength: 8192, minLength: 1 },
        currentCondition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["previousCondition", "currentCondition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { classification: { type: "string", maxLength: 8192 } },
      required: ["classification"],
    },
    ports: {
      inputs: [
        {
          id: "previousCondition",
          label: "Previous Condition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentCondition",
          label: "Current Condition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = taskSwitchPreviousConditionLabelTool.execute;
export default taskSwitchPreviousConditionLabelTool;
