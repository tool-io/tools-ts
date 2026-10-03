import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly key: string;
  readonly count: number;
  readonly retainZero: boolean;
};
export type Output = { readonly entryJson: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    count: { type: "integer", minimum: 0 },
    retainZero: { type: "boolean" },
  },
  required: ["key", "count", "retainZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { entryJson: { type: "string", maxLength: 8192 } },
  required: ["entryJson"],
} as const;
/** Compute multiset count zero removal policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { key, count, retainZero } = input;
  const compute = (): Output => {
    integer(count);
    return {
      entryJson:
        count === 0 && !retainZero ? "{}" : JSON.stringify({ [key]: count }),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { key: "apple", count: 0, retainZero: false },
  output: { entryJson: "{}" },
} satisfies ToolExample<Input, Output>;
export const multisetCountZeroRemovalPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/multiset-count-zero-removal-policy",
  title: "Multiset Count Zero Removal Policy Tool",
  description:
    "Compute multiset count zero removal policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "key",
        label: "Key",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "count",
        label: "Count",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "retainZero",
        label: "Retain Zero",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "entryJson", label: "Entry Json", valueType: { type: "string" } },
    ],
  },
});
export const run = multisetCountZeroRemovalPolicyTool.execute;
export default multisetCountZeroRemovalPolicyTool;
