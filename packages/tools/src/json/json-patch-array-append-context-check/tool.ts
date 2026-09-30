import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly operation: string;
  readonly parentIsArray: boolean;
};
export type Output = { readonly append: boolean; readonly allowed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    operation: {
      type: "string",
      maxLength: 8192,
      enum: ["add", "remove", "replace", "test"],
    },
    parentIsArray: { type: "boolean" },
  },
  required: ["token", "operation", "parentIsArray"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { append: { type: "boolean" }, allowed: { type: "boolean" } },
  required: ["append", "allowed"],
} as const;
/** Calculate json patch array append context check from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token, operation, parentIsArray } = input;
  const compute = (): Output => {
    H.domain(["add", "remove", "replace", "test"].includes(operation));
    const append = token === "-";
    return {
      append,
      allowed: !append || !parentIsArray || operation === "add",
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "-", operation: "remove", parentIsArray: true },
  output: { append: true, allowed: false },
} satisfies ToolExample<Input, Output>;
export const jsonPatchArrayAppendContextCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-patch-array-append-context-check",
    title: "JSON Patch Array Append Context Check Tool",
    description:
      "Calculate json patch array append context check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        operation: {
          type: "string",
          maxLength: 8192,
          enum: ["add", "remove", "replace", "test"],
        },
        parentIsArray: { type: "boolean" },
      },
      required: ["token", "operation", "parentIsArray"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { append: { type: "boolean" }, allowed: { type: "boolean" } },
      required: ["append", "allowed"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "operation",
          label: "Operation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentIsArray",
          label: "Parent Is Array",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "append", label: "Append", valueType: { type: "boolean" } },
        { id: "allowed", label: "Allowed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = jsonPatchArrayAppendContextCheckTool.execute;
export default jsonPatchArrayAppendContextCheckTool;
