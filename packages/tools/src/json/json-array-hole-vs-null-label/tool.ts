import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly arrayJson: string; readonly index: number };
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrayJson: { type: "string", maxLength: 8192 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["arrayJson", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Distinguish an out-of-range JSON array index from an explicit null or present value. JSON arrays cannot encode JavaScript sparse holes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrayJson, index } = request;
  const compute = (): Output => {
    const a = H.list(H.parseJson(arrayJson));
    (H.domain(
      Number.isSafeInteger(index) &&
        index >= 0 &&
        index <= Number.MAX_SAFE_INTEGER,
      "index",
    ),
      index);
    return {
      status:
        index >= a.length
          ? "absent-index"
          : a[index] === null
            ? "explicit-null"
            : "present-value",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrayJson: "[1,null,3]", index: 1 },
  output: { status: "explicit-null" },
} satisfies ToolExample<Input, Output>;
export const jsonArrayHoleVsNullLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-array-hole-vs-null-label",
    title: "JSON Array Hole Vs Null Label Tool",
    description:
      "Distinguish an out-of-range JSON array index from an explicit null or present value. JSON arrays cannot encode JavaScript sparse holes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrayJson: { type: "string", maxLength: 8192 },
        index: { type: "integer", minimum: 0 },
      },
      required: ["arrayJson", "index"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "arrayJson",
          label: "Array Json",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jsonArrayHoleVsNullLabelTool.execute;
export default jsonArrayHoleVsNullLabelTool;
