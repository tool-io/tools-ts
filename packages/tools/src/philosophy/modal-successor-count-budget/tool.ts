import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successors: number;
  readonly satisfying: number;
};
export type Output = {
  readonly box: boolean;
  readonly diamond: boolean;
  readonly counterexamples: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successors: { type: "integer", minimum: 0 },
    satisfying: { type: "integer", minimum: 0 },
  },
  required: ["successors", "satisfying"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    box: { type: "boolean" },
    diamond: { type: "boolean" },
    counterexamples: { type: "integer" },
  },
  required: ["box", "diamond", "counterexamples"],
} as const;
/** Finite modal truth from supplied successor counts, with vacuous necessity at zero successors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successors, satisfying } = request;
  const compute = (): Output => {
    H.integer(successors, 0);
    H.integer(satisfying, 0, successors);
    return {
      box: satisfying === successors,
      diamond: satisfying > 0,
      counterexamples: successors - satisfying,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { successors: 0, satisfying: 0 },
  output: { box: true, diamond: false, counterexamples: 0 },
} satisfies ToolExample<Input, Output>;
export const modalSuccessorCountBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/modal-successor-count-budget",
    title: "Modal Successor Count Budget Tool",
    description:
      "Finite modal truth from supplied successor counts, with vacuous necessity at zero successors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successors: { type: "integer", minimum: 0 },
        satisfying: { type: "integer", minimum: 0 },
      },
      required: ["successors", "satisfying"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        box: { type: "boolean" },
        diamond: { type: "boolean" },
        counterexamples: { type: "integer" },
      },
      required: ["box", "diamond", "counterexamples"],
    },
    ports: {
      inputs: [
        {
          id: "successors",
          label: "Successors",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "satisfying",
          label: "Satisfying",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "box", label: "Box", valueType: { type: "boolean" } },
        { id: "diamond", label: "Diamond", valueType: { type: "boolean" } },
        {
          id: "counterexamples",
          label: "Counterexamples",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = modalSuccessorCountBudgetTool.execute;
export default modalSuccessorCountBudgetTool;
