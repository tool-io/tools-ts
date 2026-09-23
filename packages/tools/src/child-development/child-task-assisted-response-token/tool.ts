import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly assisted: boolean;
  readonly missingToken: string;
};
export type Output = { readonly category: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    assisted: { type: "boolean" },
    missingToken: { type: "string", maxLength: 8192 },
  },
  required: ["response", "assisted", "missingToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { category: { type: "string", maxLength: 8192 } },
  required: ["category"],
} as const;
/** Separate explicitly assisted, independent and missing research responses without assigning developmental ability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, assisted, missingToken } = request;
  const compute = (): Output => {
    return {
      category:
        response === missingToken
          ? "missing"
          : assisted
            ? "assisted-response"
            : "independent-response",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: "yes", assisted: true, missingToken: "" },
  output: { category: "assisted-response" },
} satisfies ToolExample<Input, Output>;
export const childTaskAssistedResponseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/child-task-assisted-response-token",
    title: "Child Task Assisted Response Token Tool",
    description:
      "Separate explicitly assisted, independent and missing research responses without assigning developmental ability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        assisted: { type: "boolean" },
        missingToken: { type: "string", maxLength: 8192 },
      },
      required: ["response", "assisted", "missingToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { category: { type: "string", maxLength: 8192 } },
      required: ["category"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assisted",
          label: "Assisted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "missingToken",
          label: "Missing Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "category", label: "Category", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = childTaskAssistedResponseTokenTool.execute;
export default childTaskAssistedResponseTokenTool;
