import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "integer" }, upper: { type: "integer" } },
  required: ["lower", "upper"],
} as const;
/** Calculate css unicode range wildcard token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const r = /^U\+([0-9A-Fa-f]{0,5})(\?{1,6})(?![\s\S])/i.exec(token);
    H.domain(r !== null && r[1].length + r[2].length <= 6);
    const lower = parseInt(r[1] + "0".repeat(r[2].length), 16),
      upper = parseInt(r[1] + "F".repeat(r[2].length), 16);
    H.domain(upper <= 1114111);
    return { lower, upper };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "U+4??" },
  output: { lower: 1024, upper: 1279 },
} satisfies ToolExample<Input, Output>;
export const cssUnicodeRangeWildcardTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/css-unicode-range-wildcard-token",
    title: "Css Unicode Range Wildcard Token Tool",
    description:
      "Calculate css unicode range wildcard token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "integer" }, upper: { type: "integer" } },
      required: ["lower", "upper"],
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
        { id: "lower", label: "Lower", valueType: { type: "integer" } },
        { id: "upper", label: "Upper", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = cssUnicodeRangeWildcardTokenTool.execute;
export default cssUnicodeRangeWildcardTokenTool;
