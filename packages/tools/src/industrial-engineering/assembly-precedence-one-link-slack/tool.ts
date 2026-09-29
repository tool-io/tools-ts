import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predecessorStart: number;
  readonly predecessorDuration: number;
  readonly successorStart: number;
  readonly minimumLag: number;
};
export type Output = {
  readonly earliestSuccessor: number;
  readonly slack: number;
  readonly satisfied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predecessorStart: { type: "number" },
    predecessorDuration: { type: "number", minimum: 0 },
    successorStart: { type: "number" },
    minimumLag: { type: "number", minimum: 0 },
  },
  required: [
    "predecessorStart",
    "predecessorDuration",
    "successorStart",
    "minimumLag",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestSuccessor: { type: "number" },
    slack: { type: "number" },
    satisfied: { type: "boolean" },
  },
  required: ["earliestSuccessor", "slack", "satisfied"],
} as const;
/** Calculate assembly precedence one link slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predecessorStart, predecessorDuration, successorStart, minimumLag } =
    request;
  const compute = (): Output => {
    H.domain(predecessorDuration >= 0 && minimumLag >= 0);
    return {
      earliestSuccessor: predecessorStart + predecessorDuration + minimumLag,
      slack:
        successorStart - predecessorStart - predecessorDuration - minimumLag,
      satisfied:
        successorStart >= predecessorStart + predecessorDuration + minimumLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    predecessorStart: 0,
    predecessorDuration: 5,
    successorStart: 8,
    minimumLag: 1,
  },
  output: { earliestSuccessor: 6, slack: 2, satisfied: true },
} satisfies ToolExample<Input, Output>;
export const assemblyPrecedenceOneLinkSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/assembly-precedence-one-link-slack",
    title: "Assembly Precedence One Link Slack Tool",
    description:
      "Calculate assembly precedence one link slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predecessorStart: { type: "number" },
        predecessorDuration: { type: "number", minimum: 0 },
        successorStart: { type: "number" },
        minimumLag: { type: "number", minimum: 0 },
      },
      required: [
        "predecessorStart",
        "predecessorDuration",
        "successorStart",
        "minimumLag",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestSuccessor: { type: "number" },
        slack: { type: "number" },
        satisfied: { type: "boolean" },
      },
      required: ["earliestSuccessor", "slack", "satisfied"],
    },
    ports: {
      inputs: [
        {
          id: "predecessorStart",
          label: "Predecessor Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predecessorDuration",
          label: "Predecessor Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "successorStart",
          label: "Successor Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "minimumLag",
          label: "Minimum Lag",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "earliestSuccessor",
          label: "Earliest Successor",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        { id: "satisfied", label: "Satisfied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = assemblyPrecedenceOneLinkSlackTool.execute;
export default assemblyPrecedenceOneLinkSlackTool;
