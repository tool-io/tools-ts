import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly string[];
  readonly index: number;
};
export type Output = { readonly current: string; readonly next: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    index: { type: "integer" },
  },
  required: ["values", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "string", maxLength: 8192 },
    next: { type: "string", maxLength: 8192 },
  },
  required: ["current", "next"],
} as const;
/** Calculate cyclic list neighbor pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, index } = request;
  const compute = (): Output => {
    H.domain(values.length > 0);
    const r = index % values.length,
      i = r < 0 ? r + values.length : r;
    return { current: values[i], next: values[(i + 1) % values.length] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: ["A", "B", "C"], index: 2 },
  output: { current: "C", next: "A" },
} satisfies ToolExample<Input, Output>;
export const cyclicListNeighborPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/cyclic-list-neighbor-pair",
    title: "Cyclic List Neighbor Pair Tool",
    description:
      "Calculate cyclic list neighbor pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        index: { type: "integer" },
      },
      required: ["values", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        current: { type: "string", maxLength: 8192 },
        next: { type: "string", maxLength: 8192 },
      },
      required: ["current", "next"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "current", label: "Current", valueType: { type: "string" } },
        { id: "next", label: "Next", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cyclicListNeighborPairTool.execute;
export default cyclicListNeighborPairTool;
