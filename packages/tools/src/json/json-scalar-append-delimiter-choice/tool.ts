import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalarJson: string; readonly delimiter: string };
export type Output = { readonly recordText: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scalarJson: { type: "string", maxLength: 8192 },
    delimiter: {
      type: "string",
      maxLength: 8192,
      enum: ["none", "newline", "comma"],
    },
  },
  required: ["scalarJson", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordText: { type: "string", maxLength: 8192 } },
  required: ["recordText"],
} as const;
/** Serialize one explicit JSON scalar with an optional record-framing newline or comma; a comma-framed record is a JSON fragment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scalarJson, delimiter } = request;
  const compute = (): Output => {
    let value: unknown;
    try {
      value = JSON.parse(scalarJson);
    } catch {
      H.domain(false, "scalarJson");
    }
    H.domain(
      value === null ||
        typeof value === "string" ||
        typeof value === "boolean" ||
        (typeof value === "number" && Number.isFinite(value)),
      "scalarJson",
    );
    H.domain(["none", "newline", "comma"].includes(delimiter), "delimiter");
    return {
      recordText:
        JSON.stringify(value) +
        (delimiter === "newline" ? "\n" : delimiter === "comma" ? "," : ""),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scalarJson: '"hello"', delimiter: "newline" },
  output: { recordText: '"hello"\n' },
} satisfies ToolExample<Input, Output>;
export const jsonScalarAppendDelimiterChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["json", "computer science"],
      keywords: ["JSON", "computer science"],
    },
    id: "json/json-scalar-append-delimiter-choice",
    title: "JSON Scalar Append Delimiter Choice",
    description:
      "Serialize one explicit JSON scalar with an optional record-framing newline or comma; a comma-framed record is a JSON fragment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scalarJson: { type: "string", maxLength: 8192 },
        delimiter: {
          type: "string",
          maxLength: 8192,
          enum: ["none", "newline", "comma"],
        },
      },
      required: ["scalarJson", "delimiter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordText: { type: "string", maxLength: 8192 } },
      required: ["recordText"],
    },
    ports: {
      inputs: [
        {
          id: "scalarJson",
          label: "Scalar Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "delimiter",
          label: "Delimiter",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recordText",
          label: "Record Text",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonScalarAppendDelimiterChoiceTool.execute;
export default jsonScalarAppendDelimiterChoiceTool;
