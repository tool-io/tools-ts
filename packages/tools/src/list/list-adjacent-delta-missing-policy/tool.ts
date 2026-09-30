import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly values: readonly number[];
  readonly missing: readonly boolean[];
};
export type Output = {
  readonly deltas: readonly number[];
  readonly valid: readonly boolean[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["values", "missing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deltas: { type: "array", maxItems: 256, items: { type: "number" } },
    valid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["deltas", "valid"],
} as const;
/** Compute list adjacent delta missing policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { values, missing } = input;
  const compute = (): Output => {
    sameLength(values, missing);
    return {
      deltas: values
        .slice(1)
        .map((x, i) => (missing[i] || missing[i + 1] ? 0 : x - values[i])),
      valid: values.slice(1).map((_, i) => !missing[i] && !missing[i + 1]),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { values: [2, 5, 9], missing: [false, false, true] },
  output: { deltas: [3, 0], valid: [true, false] },
} satisfies ToolExample<Input, Output>;
export const listAdjacentDeltaMissingPolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-adjacent-delta-missing-policy",
  title: "List Adjacent Delta Missing Policy Tool",
  description:
    "Compute list adjacent delta missing policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "values",
        label: "Values",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "missing",
        label: "Missing",
        required: true,
        valueType: { type: "list", items: { type: "boolean" } },
      },
    ],
    outputs: [
      {
        id: "deltas",
        label: "Deltas",
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "valid",
        label: "Valid",
        valueType: { type: "list", items: { type: "boolean" } },
      },
    ],
  },
});
export const run = listAdjacentDeltaMissingPolicyTool.execute;
export default listAdjacentDeltaMissingPolicyTool;
