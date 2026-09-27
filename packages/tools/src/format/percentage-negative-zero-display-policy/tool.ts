import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly preserve: boolean };
export type Output = { readonly text: string; readonly negativeZero: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    preserve: { type: "boolean" },
  },
  required: ["token", "preserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    negativeZero: { type: "boolean" },
  },
  required: ["text", "negativeZero"],
} as const;
/** Calculate percentage negative zero display policy from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, preserve } = request;
  const compute = (): Output => {
    H.domain(/^[+-]?\d+(?:\.\d+)?(?![\s\S])/.test(token));
    const negativeZero = /^-0+(?:\.0+)?(?![\s\S])/.test(token);
    return {
      text: (negativeZero && !preserve ? token.slice(1) : token) + "%",
      negativeZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "-0.00", preserve: false },
  output: { text: "0.00%", negativeZero: true },
} satisfies ToolExample<Input, Output>;
export const percentageNegativeZeroDisplayPolicyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "format/percentage-negative-zero-display-policy",
      title: "Percentage Negative Zero Display Policy Tool",
      description:
        "Calculate percentage negative zero display policy from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          token: { type: "string", maxLength: 8192 },
          preserve: { type: "boolean" },
        },
        required: ["token", "preserve"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          negativeZero: { type: "boolean" },
        },
        required: ["text", "negativeZero"],
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
            id: "preserve",
            label: "Preserve",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "text", label: "Text", valueType: { type: "string" } },
          {
            id: "negativeZero",
            label: "Negative Zero",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = percentageNegativeZeroDisplayPolicyTool.execute;
export default percentageNegativeZeroDisplayPolicyTool;
