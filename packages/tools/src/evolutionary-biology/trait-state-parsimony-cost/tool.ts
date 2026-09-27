import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentState: string;
  readonly childState: string;
  readonly states: readonly string[];
  readonly costs: readonly (readonly number[])[];
};
export type Output = { readonly cost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentState: { type: "string", maxLength: 8192 },
    childState: { type: "string", maxLength: 8192 },
    states: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    costs: {
      type: "array",
      maxItems: 128,
      items: { type: "array", maxItems: 128, items: { type: "number" } },
    },
  },
  required: ["parentState", "childState", "states", "costs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cost: { type: "number" } },
  required: ["cost"],
} as const;
/** Look up one directed state-transition cost in an explicit supplied parsimony matrix. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentState, childState, states, costs } = request;
  const compute = (): Output => {
    H.domain(
      new Set(states).size === states.length &&
        states.includes(parentState) &&
        states.includes(childState) &&
        costs.length === states.length &&
        costs.every(
          (x) => x.length === states.length && x.every((v) => v >= 0),
        ),
    );
    return {
      cost: costs[states.indexOf(parentState)][states.indexOf(childState)],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentState: "A",
    childState: "B",
    states: ["A", "B"],
    costs: [
      [0, 2],
      [3, 0],
    ],
  },
  output: { cost: 2 },
} satisfies ToolExample<Input, Output>;
export const traitStateParsimonyCostTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/trait-state-parsimony-cost",
    title: "Trait State Parsimony Cost Tool",
    description:
      "Look up one directed state-transition cost in an explicit supplied parsimony matrix.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentState: { type: "string", maxLength: 8192 },
        childState: { type: "string", maxLength: 8192 },
        states: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        costs: {
          type: "array",
          maxItems: 128,
          items: { type: "array", maxItems: 128, items: { type: "number" } },
        },
      },
      required: ["parentState", "childState", "states", "costs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cost: { type: "number" } },
      required: ["cost"],
    },
    ports: {
      inputs: [
        {
          id: "parentState",
          label: "Parent State",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "childState",
          label: "Child State",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "states",
          label: "States",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: {
            type: "list",
            items: { type: "list", items: { type: "number" } },
          },
        },
      ],
      outputs: [{ id: "cost", label: "Cost", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = traitStateParsimonyCostTool.execute;
export default traitStateParsimonyCostTool;
