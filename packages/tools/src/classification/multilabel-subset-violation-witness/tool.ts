import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly required: readonly string[];
  readonly predicted: readonly string[];
};
export type Output = {
  readonly valid: boolean;
  readonly witness: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    predicted: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["required", "predicted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    witness: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["valid", "witness"],
} as const;
/** Compute multilabel subset violation witness from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { required, predicted } = input;
  const compute = (): Output => {
    const p = new Set(predicted),
      witness = [...new Set(required)].filter((x) => !p.has(x));
    return { valid: witness.length === 0, witness };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { required: ["a", "b"], predicted: ["a"] },
  output: { valid: false, witness: ["b"] },
} satisfies ToolExample<Input, Output>;
export const multilabelSubsetViolationWitnessTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/multilabel-subset-violation-witness",
  title: "Multilabel Subset Violation Witness Tool",
  description:
    "Compute multilabel subset violation witness from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "required",
        label: "Required",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "predicted",
        label: "Predicted",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      {
        id: "witness",
        label: "Witness",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = multilabelSubsetViolationWitnessTool.execute;
export default multilabelSubsetViolationWitnessTool;
