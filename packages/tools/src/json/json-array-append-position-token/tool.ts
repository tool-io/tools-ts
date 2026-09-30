import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly operation: string;
  readonly length: number;
};
export type Output = {
  readonly appendAllowed: boolean;
  readonly insertionIndex: number;
};
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
    length: { type: "integer", minimum: 0 },
  },
  required: ["token", "operation", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appendAllowed: { type: "boolean" },
    insertionIndex: { type: "integer" },
  },
  required: ["appendAllowed", "insertionIndex"],
} as const;
/** Resolve a supplied final array token for an insertion context; - is special only for add. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, operation, length } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    H.domain(["add", "remove", "replace", "test"].includes(operation));
    const appendAllowed = token === "-" && operation === "add";
    const numeric = /^(0|[1-9]\d*)(?![\s\S])/.test(token) ? Number(token) : -1;
    return {
      appendAllowed,
      insertionIndex: appendAllowed
        ? length
        : Number.isSafeInteger(numeric) && numeric >= 0 && numeric <= length
          ? numeric
          : -1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "-", operation: "add", length: 3 },
  output: { appendAllowed: true, insertionIndex: 3 },
} satisfies ToolExample<Input, Output>;
export const jsonArrayAppendPositionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-array-append-position-token",
    title: "JSON Array Append Position Token Tool",
    description:
      "Resolve a supplied final array token for an insertion context; - is special only for add.",
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
        length: { type: "integer", minimum: 0 },
      },
      required: ["token", "operation", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appendAllowed: { type: "boolean" },
        insertionIndex: { type: "integer" },
      },
      required: ["appendAllowed", "insertionIndex"],
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
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "appendAllowed",
          label: "Append Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "insertionIndex",
          label: "Insertion Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonArrayAppendPositionTokenTool.execute;
export default jsonArrayAppendPositionTokenTool;
