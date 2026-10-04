import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: string };
export type Output = { readonly kind: string; readonly seconds: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "string", maxLength: 8192 } },
  required: ["value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", maxLength: 8192 },
    seconds: { type: "string", maxLength: 8192 },
  },
  required: ["kind", "seconds"],
} as const;
/** Compute http retry after delta date token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value } = input;
  const compute = (): Output => {
    if (/^\d+(?![\s\S])/.test(value))
      return { kind: "delta-seconds", seconds: BigInt(value).toString() };
    domain(
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} GMT(?![\s\S])/.test(
        value,
      ),
    );
    return { kind: "http-date", seconds: "" };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "00120" },
  output: { kind: "delta-seconds", seconds: "120" },
} satisfies ToolExample<Input, Output>;
export const httpRetryAfterDeltaDateTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "web/http-retry-after-delta-date-token",
  title: "HTTP Retry After Delta Date Token Tool",
  description:
    "Compute http retry after delta date token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "kind", label: "Kind", valueType: { type: "string" } },
      { id: "seconds", label: "Seconds", valueType: { type: "string" } },
    ],
  },
});
export const run = httpRetryAfterDeltaDateTokenTool.execute;
export default httpRetryAfterDeltaDateTokenTool;
