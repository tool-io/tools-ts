import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly inner: string; readonly uncertain: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inner: { type: "string", maxLength: 8192 },
    uncertain: { type: "boolean" },
  },
  required: ["inner", "uncertain"],
} as const;
/** Separate an explicitly supplied uncertainty wrapper from an opaque call token. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(token.length > 0, "token");
    const wrapped = token.startsWith("(") && token.endsWith(")"),
      question = token.endsWith("?");
    H.domain(!(wrapped && question), "token");
    return {
      inner: wrapped
        ? token.slice(1, -1)
        : question
          ? token.slice(0, -1)
          : token,
      uncertain: wrapped || question,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "(*1/*4)" },
  output: { inner: "*1/*4", uncertain: true },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicCallUncertaintyMarkerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogenomic-call-uncertainty-marker",
      title: "Pharmacogenomic Call Uncertainty Marker Tool",
      description:
        "Separate an explicitly supplied uncertainty wrapper from an opaque call token.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inner: { type: "string", maxLength: 8192 },
          uncertain: { type: "boolean" },
        },
        required: ["inner", "uncertain"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "inner", label: "Inner", valueType: { type: "string" } },
          {
            id: "uncertain",
            label: "Uncertain",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenomicCallUncertaintyMarkerTool.execute;
export default pharmacogenomicCallUncertaintyMarkerTool;
