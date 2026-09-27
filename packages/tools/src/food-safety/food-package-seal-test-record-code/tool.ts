import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly suppliedCodes: readonly string[];
  readonly recordSource: string;
};
export type Output = {
  readonly recognized: boolean;
  readonly recordKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    suppliedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordSource: { type: "string", maxLength: 8192 },
  },
  required: ["code", "suppliedCodes", "recordSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    recordKey: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "recordKey"],
} as const;
/** Retain a supplied seal-test record code without inventing an acceptance standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, suppliedCodes, recordSource } = request;
  const compute = (): Output => {
    H.domain(
      new Set(suppliedCodes).size === suppliedCodes.length &&
        recordSource.length > 0,
    );
    return {
      recognized: suppliedCodes.includes(code),
      recordKey: JSON.stringify([recordSource, code]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { code: "P", suppliedCodes: ["P", "F"], recordSource: "method-v1" },
  output: { recognized: true, recordKey: '["method-v1","P"]' },
} satisfies ToolExample<Input, Output>;
export const foodPackageSealTestRecordCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-package-seal-test-record-code",
    title: "Food Package Seal Test Record Code Tool",
    description:
      "Retain a supplied seal-test record code without inventing an acceptance standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        suppliedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordSource: { type: "string", maxLength: 8192 },
      },
      required: ["code", "suppliedCodes", "recordSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        recordKey: { type: "string", maxLength: 8192 },
      },
      required: ["recognized", "recordKey"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCodes",
          label: "Supplied Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordSource",
          label: "Record Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "recordKey", label: "Record Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = foodPackageSealTestRecordCodeTool.execute;
export default foodPackageSealTestRecordCodeTool;
