import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly count: number; readonly deficit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0 },
    second: { type: "integer", minimum: 0 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" }, deficit: { type: "integer" } },
  required: ["count", "deficit"],
} as const;
/** Calculate multiset subtraction truncated one key from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.integer(first, 0);
    H.integer(second, 0);
    return {
      count: Math.max(0, first - second),
      deficit: Math.max(0, second - first),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 5, second: 3 },
  output: { count: 2, deficit: 0 },
} satisfies ToolExample<Input, Output>;
export const multisetSubtractionTruncatedOneKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/multiset-subtraction-truncated-one-key",
    title: "Multiset Subtraction Truncated One Key Tool",
    description:
      "Calculate multiset subtraction truncated one key from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 0 },
        second: { type: "integer", minimum: 0 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" }, deficit: { type: "integer" } },
      required: ["count", "deficit"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
        { id: "deficit", label: "Deficit", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = multisetSubtractionTruncatedOneKeyTool.execute;
export default multisetSubtractionTruncatedOneKeyTool;
