import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly canReverse: boolean;
  readonly reversalCost: number;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canReverse: { type: "boolean" },
    reversalCost: { type: "number", minimum: 0 },
  },
  required: ["canReverse", "reversalCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Tag an explicitly assessed decision reversibility state. The cost is a caller-defined amount and must be zero when no reversal exists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { canReverse, reversalCost } = request;
  const compute = (): Output => {
    H.domain(reversalCost >= 0, "reversalCost");
    H.domain(canReverse || reversalCost === 0, "reversalCost");
    return {
      tag: canReverse
        ? "reversible; stated reversal cost " + reversalCost
        : "irreversible",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { canReverse: true, reversalCost: 50 },
  output: { tag: "reversible; stated reversal cost 50" },
} satisfies ToolExample<Input, Output>;
export const decisionReversibilityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/decision-reversibility-tag",
    title: "Decision Reversibility Tag Tool",
    description:
      "Tag an explicitly assessed decision reversibility state. The cost is a caller-defined amount and must be zero when no reversal exists.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canReverse: { type: "boolean" },
        reversalCost: { type: "number", minimum: 0 },
      },
      required: ["canReverse", "reversalCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "canReverse",
          label: "Can Reverse",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reversalCost",
          label: "Reversal Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = decisionReversibilityTagTool.execute;
export default decisionReversibilityTagTool;
