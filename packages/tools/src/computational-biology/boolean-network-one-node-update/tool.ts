import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputs: readonly boolean[];
  readonly operator: string;
  readonly invert: boolean;
};
export type Output = { readonly next: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputs: { type: "array", maxItems: 256, items: { type: "boolean" } },
    operator: { type: "string", maxLength: 8192, enum: ["and", "or", "xor"] },
    invert: { type: "boolean" },
  },
  required: ["inputs", "operator", "invert"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "boolean" } },
  required: ["next"],
} as const;
/** Evaluate one supplied Boolean node rule; empty AND is true, empty OR and XOR are false. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputs, operator, invert } = request;
  const compute = (): Output => {
    H.domain(["and", "or", "xor"].includes(operator));
    const value =
      operator === "and"
        ? inputs.every(Boolean)
        : operator === "or"
          ? inputs.some(Boolean)
          : inputs.filter(Boolean).length % 2 === 1;
    return { next: invert ? !value : value };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputs: [true, false], operator: "and", invert: false },
  output: { next: false },
} satisfies ToolExample<Input, Output>;
export const booleanNetworkOneNodeUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/boolean-network-one-node-update",
    title: "Boolean Network One Node Update Tool",
    description:
      "Evaluate one supplied Boolean node rule; empty AND is true, empty OR and XOR are false.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputs: { type: "array", maxItems: 256, items: { type: "boolean" } },
        operator: {
          type: "string",
          maxLength: 8192,
          enum: ["and", "or", "xor"],
        },
        invert: { type: "boolean" },
      },
      required: ["inputs", "operator", "invert"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { next: { type: "boolean" } },
      required: ["next"],
    },
    ports: {
      inputs: [
        {
          id: "inputs",
          label: "Inputs",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "operator",
          label: "Operator",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "invert",
          label: "Invert",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "next", label: "Next", valueType: { type: "boolean" } }],
    },
  },
  calculate,
});
export const run = booleanNetworkOneNodeUpdateTool.execute;
export default booleanNetworkOneNodeUpdateTool;
