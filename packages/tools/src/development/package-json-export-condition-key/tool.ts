import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly key: string };
export type Output = {
  readonly numeric: boolean;
  readonly defaultCondition: boolean;
  readonly valid: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeric: { type: "boolean" },
    defaultCondition: { type: "boolean" },
    valid: { type: "boolean" },
  },
  required: ["numeric", "defaultCondition", "valid"],
} as const;
/** Compute package json export condition key from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { key } = input;
  const compute = (): Output => {
    const numeric = /^(0|[1-9]\d*)(?![\s\S])/.test(key);
    return {
      numeric,
      defaultCondition: key === "default",
      valid:
        key.length > 0 &&
        !key.startsWith(".") &&
        !key.includes(",") &&
        !numeric,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { key: "default" },
  output: { numeric: false, defaultCondition: true, valid: true },
} satisfies ToolExample<Input, Output>;
export const packageJsonExportConditionKeyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "development/package-json-export-condition-key",
  title: "Package JSON Export Condition Key Tool",
  description:
    "Compute package json export condition key from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "numeric", label: "Numeric", valueType: { type: "boolean" } },
      {
        id: "defaultCondition",
        label: "Default Condition",
        valueType: { type: "boolean" },
      },
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
    ],
  },
});
export const run = packageJsonExportConditionKeyTool.execute;
export default packageJsonExportConditionKeyTool;
