import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = { readonly weeks: number; readonly days: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weeks: { type: "integer" }, days: { type: "integer" } },
  required: ["weeks", "days"],
} as const;
/** Compute iso duration week only token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const m = /^P(0|[1-9]\d{0,6})W(?![\s\S])/.exec(token);
    domain(m);
    return { weeks: Number(m[1]), days: Number(m[1]) * 7 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "P3W" },
  output: { weeks: 3, days: 21 },
} satisfies ToolExample<Input, Output>;
export const isoDurationWeekOnlyTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/iso-duration-week-only-token",
  title: "ISO Duration Week Only Token Tool",
  description:
    "Compute iso duration week only token from explicit bounded inputs.",
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
      { id: "weeks", label: "Weeks", valueType: { type: "integer" } },
      { id: "days", label: "Days", valueType: { type: "integer" } },
    ],
  },
});
export const run = isoDurationWeekOnlyTokenTool.execute;
export default isoDurationWeekOnlyTokenTool;
