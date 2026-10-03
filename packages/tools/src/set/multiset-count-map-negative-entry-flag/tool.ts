import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly keys: readonly string[];
  readonly counts: readonly number[];
};
export type Output = {
  readonly valid: boolean;
  readonly negativeKeys: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    keys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["keys", "counts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    negativeKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["valid", "negativeKeys"],
} as const;
/** Compute multiset count map negative entry flag from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { keys, counts } = input;
  const compute = (): Output => {
    sameLength(keys, counts);
    domain(new Set(keys).size === keys.length);
    const negativeKeys = keys.filter((_, i) => counts[i] < 0);
    return { valid: negativeKeys.length === 0, negativeKeys };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { keys: ["a", "b"], counts: [1, -2] },
  output: { valid: false, negativeKeys: ["b"] },
} satisfies ToolExample<Input, Output>;
export const multisetCountMapNegativeEntryFlagTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/multiset-count-map-negative-entry-flag",
  title: "Multiset Count Map Negative Entry Flag Tool",
  description:
    "Compute multiset count map negative entry flag from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "keys",
        label: "Keys",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "counts",
        label: "Counts",
        required: true,
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      {
        id: "negativeKeys",
        label: "Negative Keys",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = multisetCountMapNegativeEntryFlagTool.execute;
export default multisetCountMapNegativeEntryFlagTool;
