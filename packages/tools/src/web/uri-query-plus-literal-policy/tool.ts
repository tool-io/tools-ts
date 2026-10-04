import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly query: string; readonly plusPolicy: string };
export type Output = { readonly value: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    query: { type: "string", maxLength: 8192 },
    plusPolicy: {
      type: "string",
      maxLength: 8192,
      enum: ["literal", "form-space"],
    },
  },
  required: ["query", "plusPolicy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
/** Decode one supplied query component with an explicit literal-plus versus form-space policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { query, plusPolicy } = request;
  const compute = (): Output => {
    H.domain(["literal", "form-space"].includes(plusPolicy));
    let value: string;
    try {
      value = decodeURIComponent(
        plusPolicy === "form-space" ? query.replaceAll("+", " ") : query,
      );
    } catch {
      H.domain(false, "query", "Enter valid percent-encoded UTF-8.");
    }
    return { value };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { query: "a+b%2Bc", plusPolicy: "literal" },
  output: { value: "a+b+c" },
} satisfies ToolExample<Input, Output>;
export const uriQueryPlusLiteralPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/uri-query-plus-literal-policy",
    title: "URI Query Plus Literal Policy Tool",
    description:
      "Decode one supplied query component with an explicit literal-plus versus form-space policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: { type: "string", maxLength: 8192 },
        plusPolicy: {
          type: "string",
          maxLength: 8192,
          enum: ["literal", "form-space"],
        },
      },
      required: ["query", "plusPolicy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "string", maxLength: 8192 } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "query",
          label: "Query",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "plusPolicy",
          label: "Plus Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "value", label: "Value", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = uriQueryPlusLiteralPolicyTool.execute;
export default uriQueryPlusLiteralPolicyTool;
