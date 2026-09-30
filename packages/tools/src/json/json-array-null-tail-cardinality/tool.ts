import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  parseJson,
  list,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly json: string };
export type Output = {
  readonly length: number;
  readonly trailingNulls: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { json: { type: "string", maxLength: 8192 } },
  required: ["json"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer" },
    trailingNulls: { type: "integer" },
  },
  required: ["length", "trailingNulls"],
} as const;
/** Compute json array null tail cardinality from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { json } = input;
  const compute = (): Output => {
    const a = list(parseJson(json));
    let trailingNulls = 0;
    for (let i = a.length - 1; i >= 0 && a[i] === null; i--) trailingNulls++;
    return { length: a.length, trailingNulls };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { json: "[1,null,null]" },
  output: { length: 3, trailingNulls: 2 },
} satisfies ToolExample<Input, Output>;
export const jsonArrayNullTailCardinalityTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "json/json-array-null-tail-cardinality",
  title: "JSON Array Null Tail Cardinality Tool",
  description:
    "Compute json array null tail cardinality from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "json",
        label: "Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "length", label: "Length", valueType: { type: "integer" } },
      {
        id: "trailingNulls",
        label: "Trailing Nulls",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = jsonArrayNullTailCardinalityTool.execute;
export default jsonArrayNullTailCardinalityTool;
