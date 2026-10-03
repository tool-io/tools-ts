import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly element: string;
  readonly left: readonly string[];
  readonly right: readonly string[];
};
export type Output = { readonly witness: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    element: { type: "string", maxLength: 8192 },
    left: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    right: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["element", "left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { witness: { type: "boolean" } },
  required: ["witness"],
} as const;
/** Compute set pair disjointness single element witness from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { element, left, right } = input;
  const compute = (): Output => {
    return { witness: left.includes(element) && right.includes(element) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { element: "b", left: ["a", "b"], right: ["b", "c"] },
  output: { witness: true },
} satisfies ToolExample<Input, Output>;
export const setPairDisjointnessSingleElementWitnessTool =
  defineSchemaCalculation<Input, Output>({
    id: "set/set-pair-disjointness-single-element-witness",
    title: "Set Pair Disjointness Single Element Witness Tool",
    description:
      "Compute set pair disjointness single element witness from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "element",
          label: "Element",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "left",
          label: "Left",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "right",
          label: "Right",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "witness", label: "Witness", valueType: { type: "boolean" } },
      ],
    },
  });
export const run = setPairDisjointnessSingleElementWitnessTool.execute;
export default setPairDisjointnessSingleElementWitnessTool;
