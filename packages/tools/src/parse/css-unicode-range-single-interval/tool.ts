import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly start: number; readonly end: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { start: { type: "integer" }, end: { type: "integer" } },
  required: ["start", "end"],
} as const;
/** Compute css unicode range single interval from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^U\+([0-9a-f]{1,6})(?:-([0-9a-f]{1,6}))?(?![\s\S])/i.exec(token);
    domain(m);
    const start = parseInt(m[1], 16),
      end = m[2] ? parseInt(m[2], 16) : start;
    domain(start <= end && end <= 0x10ffff);
    return { start, end };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "U+0041-005A" },
  output: { start: 65, end: 90 },
} satisfies ToolExample<Input, Output>;
export const cssUnicodeRangeSingleIntervalTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/css-unicode-range-single-interval",
  title: "Css Unicode Range Single Interval Tool",
  description:
    "Compute css unicode range single interval from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "start", label: "Start", valueType: { type: "integer" } },
      { id: "end", label: "End", valueType: { type: "integer" } },
    ],
  },
});
export const run = cssUnicodeRangeSingleIntervalTool.execute;
export default cssUnicodeRangeSingleIntervalTool;
