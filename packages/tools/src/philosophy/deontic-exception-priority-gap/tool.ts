import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rulePriority: number;
  readonly exceptionPriority: number;
  readonly exceptionApplies: boolean;
  readonly equalityToException: boolean;
};
export type Output = {
  readonly priorityGap: number;
  readonly exceptionWins: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rulePriority: { type: "number" },
    exceptionPriority: { type: "number" },
    exceptionApplies: { type: "boolean" },
    equalityToException: { type: "boolean" },
  },
  required: [
    "rulePriority",
    "exceptionPriority",
    "exceptionApplies",
    "equalityToException",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priorityGap: { type: "number" },
    exceptionWins: { type: "boolean" },
  },
  required: ["priorityGap", "exceptionWins"],
} as const;
/** Compare caller-supplied priorities under an explicit equality convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    rulePriority,
    exceptionPriority,
    exceptionApplies,
    equalityToException,
  } = request;
  const compute = (): Output => {
    return {
      priorityGap: exceptionPriority - rulePriority,
      exceptionWins:
        exceptionApplies &&
        (exceptionPriority > rulePriority ||
          (exceptionPriority === rulePriority && equalityToException)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rulePriority: 2,
    exceptionPriority: 3,
    exceptionApplies: true,
    equalityToException: false,
  },
  output: { priorityGap: 1, exceptionWins: true },
} satisfies ToolExample<Input, Output>;
export const deonticExceptionPriorityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/deontic-exception-priority-gap",
    title: "Deontic Exception Priority Gap Tool",
    description:
      "Compare caller-supplied priorities under an explicit equality convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rulePriority: { type: "number" },
        exceptionPriority: { type: "number" },
        exceptionApplies: { type: "boolean" },
        equalityToException: { type: "boolean" },
      },
      required: [
        "rulePriority",
        "exceptionPriority",
        "exceptionApplies",
        "equalityToException",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priorityGap: { type: "number" },
        exceptionWins: { type: "boolean" },
      },
      required: ["priorityGap", "exceptionWins"],
    },
    ports: {
      inputs: [
        {
          id: "rulePriority",
          label: "Rule Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exceptionPriority",
          label: "Exception Priority",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exceptionApplies",
          label: "Exception Applies",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "equalityToException",
          label: "Equality To Exception",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "priorityGap",
          label: "Priority Gap",
          valueType: { type: "number" },
        },
        {
          id: "exceptionWins",
          label: "Exception Wins",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = deonticExceptionPriorityGapTool.execute;
export default deonticExceptionPriorityGapTool;
