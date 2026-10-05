import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly index: number;
};
export type Output = { readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    index: { type: "integer", minimum: 0 },
  },
  required: ["values", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" } },
  required: ["difference"],
} as const;
/** Return one entry of the first forward-difference row from adjacent sequence values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, index } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(index) && index >= 0 && index <= values.length - 2,
      "index",
    ),
      index);
    return { difference: values[index + 1] - values[index] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [2, 5, 11, 20], index: 1 },
  output: { difference: 6 },
} satisfies ToolExample<Input, Output>;
export const finiteDifferenceRowEntryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/finite-difference-row-entry",
    title: "Finite Difference Row Entry Tool",
    description:
      "Return one entry of the first forward-difference row from adjacent sequence values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        index: { type: "integer", minimum: 0 },
      },
      required: ["values", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" } },
      required: ["difference"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = finiteDifferenceRowEntryTool.execute;
export default finiteDifferenceRowEntryTool;
